const { firebaseConfig } = require('firebase-functions')
const { admin, db } = require('../util/admin')

exports.createPost = (req, res) => {
  let newPost = {
    type: req.body.type,
    body: req.body.body,
    album: req.body.album,
    artist: req.body.artist,
    track: req.body.track,
    title: req.body.title,
    topic: req.body.topic,
    pic: req.body.pic,
    createdAt: new Date().toISOString(),
    rating: req.body.rating,
    spotifyid: req.body.spotifyid,
    authorid: req.user.id,
    pfp: req.user.profilepic,
    username: req.user.username,
    likeCount: 0,
    commentCount: 0
  }
  db.collection('posts').add(newPost).then(() => {
    if (req.auth.refreshed) {
      return res.json({ success: "Successfully created post.", refreshed: true, expires: req.auth.expires, token: req.auth.token })
    } else {
      return res.json({ success: "Successfully created post." })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Error creating post." })
  })
}

exports.getAllPosts = (req, res) => {
  db.collection('posts').orderBy('createdAt', 'desc').get().then(snap => {
    let posts = []
    snap.forEach(doc => {
      let post = {
        ...doc.data(),
        postId: doc.id
      }
      posts.push(post)
    })
    return res.json(posts)
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Error getting posts." });
  });
}

exports.getPostsByType = (req, res) => {
  const type = req.params.type
  db.collection('posts').where("type", "==", type).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({ ...post.data(), id: post.id })
    })
    return res.json({ posts })
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPostsByTopic = (req, res) => {
  const topic = req.params.topic
  db.collection('posts').where("topic", "==", topic).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({ ...post.data(), id: post.id })
    })
    return res.json({ posts })
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPostsByUser = (req, res) => {
  const id = req.params.user
  db.collection('posts').where("id", "==", id).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({ ...post.data(), id: post.id })
    })
    return res.json({ posts })
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPost = (req, res) => {
  let postData = {}
  db.doc(`/posts/${req.params.postId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Could not find post." })
      }
      postData.post = doc.data()
      postData.id = doc.id
      return db
        .collection('comments')
        .where('postId', '==', req.params.postId)
        .get();
    })
    .then((data) => {
      postData.post.comments = [];
      data.forEach((doc) => {
        theDoc = doc.data()
        theDoc.id = doc.id
        postData.post.comments.push(theDoc)
      })
      return res.json(postData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: "Error getting post." })
    })
  }

exports.deletePost = (req, res) => {
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if (!doc.exists) {
      return res.status(404).json({ error: "Could not find post." })
    }
    let post = doc.data()
    if (post.authorid === req.user.id) {
      doc.ref.delete().then(() => {
        if (req.auth.refreshed) {
          return res.json({ success: "Successfully deleted post", refreshed: true, token: req.auth.token, expires: req.auth.expires })
        } else {
          return res.json({ success: "Successfully deleted post" })
        }
        // delete comments and likes and stuff
      }).catch(err => {
        console.error(err)
        return res.status(500).json({ error: "Error deleting post" })
      })
    } else {
      console.log(post.authorid, req.user.id)
      return res.status(400).json({ error: "Post isnt yours lol" })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Could not get post" })
  })
}

exports.editPost = (req, res) => {
  console.log(req.params.postId)
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if (!doc.exists) {
      return res.status(404).json({ error: "Post does not exist" })
    }
    if (doc.data().authorid === req.user.id) {
      doc.ref.update(req.body.update).then(() => {
        if (req.auth.refreshed) {
          return res.json({ success: "Successfully edited post", refreshed: true, token: req.auth.token, expires: req.auth.expires })
        } else {
          return res.json({ success: "Successfully edited post", doc: { ...doc.data(), ...req.body.update } })
        }
      }).catch(err => {
        console.error(err)
        return res.status(500).json({ error: "Error updating post." })
      })
    } else {
      return res.status(403).json({ error: "post isnt yours lol" })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Error getting post" })
  })
}

exports.createComment = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty' })

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    postId: req.body.postId,
    authorid: req.body.authorid,
    username: req.user.username,
    pfp: req.body.pfp
  }

  console.log("\n\n-Comment---")
  console.log(newComment)
  console.log("----------\n\n")

  db.collection('comments').add(newComment).then(() => {
    db.collection('posts').doc(newComment.postId).update({commentCount: admin.firestore.FieldValue.increment(1)})
    if (req.auth.refreshed) {
      return res.json({ success: "Successfully created post.", refreshed: true, expires: req.auth.expires, token: req.auth.token, newComment })
    } else {
      return res.json({ success: "Successfully created post.", newComment })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Error creating post." })
  })
}

exports.editComment = (req, res) => {
  console.log(req.params.postId)
  db.doc(`/comments/${req.params.postId}`).get().then(doc => {
    if (!doc.exists) {
      return res.status(404).json({ error: "Post does not exist" })
    }
    if (doc.data().authorid === req.user.id) {
      doc.ref.update(req.body.update).then(() => {
        if (req.auth.refreshed) {
          return res.json({ success: "Successfully edited post", refreshed: true, token: req.auth.token, expires: req.auth.expires })
        } else {
          return res.json({ success: "Successfully edited post", doc: { ...doc.data(), ...req.body.update } })
        }
      }).catch(err => {
        console.error(err)
        return res.status(500).json({ error: "Error updating post." })
      })
    } else {
      return res.status(403).json({ error: "post isnt yours lol" })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Error getting post" })
  })
}

exports.deleteComment = (req, res) => {
   db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if (!doc.exists) {
      return res.status(404).json({ error: "Could not find post." })
    }
    let post = doc.data()
    if (post.authorid === req.user.id) {
      doc.ref.delete().then(() => {
        db.collection('posts').doc(newComment.postId).update({commentCount: admin.firestore.FieldValue.increment(-1)})
        if (req.auth.refreshed) {
          return res.json({ success: "Successfully deleted post", refreshed: true, token: req.auth.token, expires: req.auth.expires })
        } else {
          return res.json({ success: "Successfully deleted post" })
        }
        // delete comments and likes and stuff
      }).catch(err => {
        console.error(err)
        return res.status(500).json({ error: "Error deleting post" })
      })
    } else {
      console.log(post.authorid, req.user.id)
      return res.status(400).json({ error: "Post isnt yours lol" })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({ error: "Could not get post" })
  })
}

exports.likePost = (req,res) => {

  let likeDoc = {
    postId: req.params.postId,
    authorid: req.user.id,
    authorName: req.user.username
  }

  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if(!doc.exists){
      return res.status(404).json({error: "Cannot like post that does not exist."})
    } else {
      db.collection('likes').where('authorid', '==', req.user.id).where('postId', '==', req.params.postId).limit(1).get().then(snap => {
        if(snap.size === 0){
          var batch = db.batch() //create batch
          var newLikeRef = db.collection('likes').doc() //make a new empty like document
          batch.set(newLikeRef, likeDoc) //set new like document data
          batch.update(doc.ref, {likeCount: doc.data().likeCount + 1}) //increase like count on post
          batch.commit().then(() => { //commit batch
            if(req.auth.refreshed){
              return res.json({success: "Successfully created like", refreshed: true, token: req.auth.token, expires: req.auth.expires, like: likeDoc})
            } else {
              return res.json({success: "Successfully created like", like: likeDoc})
            }
          }).catch(err => {
            console.error(err)
            return res.status(500).json({error: "Error committing batch"})
          })
        } else {
          return res.status(400).json({error: "Post has already been liked by user."})
        }
      }).catch(err => {
        console.error(err)
        return res.status(500).json({error: "Error getting likes"})
      })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Error getting post"})
  })
}

exports.unlikePost = (req,res) => {
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if(!doc.exists){
      return res.status(404).json({error: "Post not found"})
    } else {
      db.collection('likes').where('authorid', '==', req.user.id).where('postId', '==', req.params.postId).limit(1).get().then(snap => {
        if(snap.size === 0){
          return res.status(400).json({error: "Like document does not exist"})
        } else {
          var batch = db.batch()
          batch.delete(snap.docs[0].ref)
          batch.update(doc.ref, {likeCount: doc.data().likeCount - 1})
          batch.commit().then(() => {
            if(req.auth.refreshed){
              return res.json({success: "Successfully removed like", refreshed: true, token: req.auth.token, expires: req.auth.expires})
            } else {
              return res.json({success: "Successfully removed like"})
            }
          }).catch(err => {
            console.error(err)
            return res.status(500).json({error: "Error committing batch"})
          })
        }
      }).catch(err => {
        console.error(err)
        return res.status(500).json({error: "Error getting like"})
      })
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Could not get post"})
  })
}