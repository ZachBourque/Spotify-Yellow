const functions = require('firebase-functions');
var cors = require("cors")
const express = require('express');
const app = express();
app.use(cors())

const { login, callback, createUser, getUser, getSelf, uploadPic, editBio, updatePfp, getToken, editFavorites, getUsers} = require('./handlers/users')
const { validateUser } = require('./util/admin')
const { createPost, getAllPosts, getPostsByTopic, getPostsByType, getPostsByUser, getPost, deletePost, editPost, likePost, unlikePost } = require('./handlers/posts')

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
//Post Routes
app.post('/createPost', validateUser, createPost)
app.get('/postsByType/:type', getPostsByType)
app.get('/allPosts', getAllPosts)
app.get('/postsByTopic/:topic', getPostsByTopic)
app.get('/postsByUser/:user', getPostsByUser)
app.get('/post/:postId', getPost)
app.delete('/post/:postId', validateUser, deletePost)
app.put('/editPost/:postId', validateUser, editPost)
app.get('/post/:postId/like', validateUser, likePost)
app.get('/post/:postId/unlike', validateUser, unlikePost)

exports.api = functions.https.onRequest(app)