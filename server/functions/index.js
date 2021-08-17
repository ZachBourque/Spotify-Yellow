const functions = require('firebase-functions');
var cors = require("cors")
const express = require('express');
const app = express();
app.use(cors())

const { login, callback, createUser, getUser, getSelf, uploadPic, editBio, updatePfp, getToken, editFavorites, getUsers, markNotificationsRead, sendNotification} = require('./handlers/users')
const { validateUser, db } = require('./util/admin')
const { createPost, getAllPosts, getPostsByTopic, getPostsByType, getPostsByUser, getPost, deletePost, editPost, createComment, editComment, deleteComment, likePost, unlikePost } = require('./handlers/posts')

//User Routes
app.get('/login', login);
app.get('/callback', callback);
app.post('/createUser', createUser)
app.get('/getUser/:id', getUser)
app.get('/self', validateUser, getSelf)
app.post('/uploadpic', uploadPic)
app.post('/editFavorites', validateUser, editFavorites)
app.post('/editBio', validateUser, editBio)
app.put('/updatePfp', validateUser, updatePfp)
app.get('/token', getToken)
app.get('/users', getUsers)
app.post('/notificationsMarkRead', validateUser, markNotificationsRead)
app.post('/sendNotification', validateUser, sendNotification)

//Post Routes
app.post('/createPost', validateUser, createPost)
app.get('/postsByType/:type', getPostsByType)
app.get('/allPosts', getAllPosts)
app.get('/postsByTopic/:topic', getPostsByTopic)
app.get('/postsByUser/:user', getPostsByUser)
app.get('/post/:postId', getPost)
app.delete('/post/:postId', validateUser, deletePost)
app.put('/editPost/:postId', validateUser, editPost)
app.post('/post/:postId/comment', validateUser, createComment)
app.put('/editComment/:commentId', validateUser, editComment)
app.delete('/deleteComment/:commentId', validateUser, deleteComment)
app.get('/post/:postId/like', validateUser, likePost)
app.get('/post/:postId/unlike', validateUser, unlikePost)

exports.createNotificationOnLike = functions.firestore.document('likes/{id}').onCreate(snapshot => {
	console.log("on like")
	return db.doc(`/posts/${snapshot.data().postId}`).get().then(doc => {
		if(doc.exists && doc.data().authorid !== snapshot.data().authorid){
			return db.doc(`/notifications/${snapshot.id}`).set({
				createdAt: new Date().toISOString(),
				type: "like",
				read: false,
				postId: doc.id,
				sender: snapshot.data().authorid,
				senderName: snapshot.data().authorName,
				receiver: doc.data().authorid,
				pic: null
			})
		}
	}).catch(err => console.error(err))
})

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}').onDelete(snapshot => {
	console.log("on unlike")
	return db.doc(`/notifications/${snapshot.id}`).delete().catch(err => {
		console.error(err)
		return
	})
})

exports.createNotificationOnComment = functions.firestore.document('comments/{id}').onCreate(snapshot => {
	return db.doc(`/posts/${snapshot.data().postId}`).get().then(doc => {
		if(doc.exists && doc.data().authorid !== snapshot.data().authorid){
			return db.doc(`/notifications/${snapshot.id}`).set({
				createdAt: new Date().toISOString(),
				type: "comment",
				read: false,
				postId: doc.id,
				sender: snapshot.data().authorid,
				senderName: snapshot.data().username,
				receiver: doc.data().authorid,
				pic: null
			})
		}
	}).catch(err => console.error(err))
})

exports.deleteNotificationsOnCommentDelete = functions.firestore.document('comments/{id}').onDelete(snapshot => {
	return db.doc(`/notifications/${snapshot.id}`).delete().catch(err => {
		console.error(err)
		return
	})
})

exports.onPostDelete = functions.firestore.document('posts/{id}').onDelete((snapshot, context) => {
	const postId = snapshot.data().postId
	const batch = db.batch()
	return db.collection('likes').where('postId', '==', postId).get().then(data => {
		data.forEach(doc => {
			batch.delete(db.doc(`/likes/${doc.id}`))
		})
		return db.collection('comments').where('postId', '==', postId).get()
	}).then(data => {
		data.forEach(doc => {
			batch.delete(db.doc(`/comments/${doc.id}`))
		})
		return db.collection('notifications').where('postId', '==', postId).get()
	}).then(data => {
		data.forEach(doc => {
			batch.delete(db.doc(`/notifications/${doc.id}`))
		})
		return batch.commit()
	}).catch(err => console.error(err))

})

exports.onUserImageChange = functions.firestore.document('users/{id}').onUpdate(change => {
	const pfp = change.after.data().profilepic
	const id = change.after.data().id
	if(change.before.data().profilepic !== pfp){
		const batch = db.batch()
		return db.collection('posts').where('authorid', '==', id).get().then(data => {
			console.log(data.size)
			data.forEach(doc => {
				batch.update(db.doc(`/posts/${doc.id}`), {pfp})
			})
			db.collection('comments').where('authorid', '==', id).get().then(data2 => {
				console.log(data2.size)
				data2.forEach(doc => {
					batch.update(db.doc(`/comments/${doc.id}`), {pfp})
				})
				console.log('committing')
				batch.commit()
			})
		})
	} else {
		console.log("no change", pfp, change.before.data().profilepic)
	}
})

exports.api = functions.https.onRequest(app)