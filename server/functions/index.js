const functions = require('firebase-functions');
var cors = require("cors")
const express = require('express');
const app = express();
app.use(cors())

const { login, callback, createUser, getUser, getSelf, uploadPic, addFavorite, removeFavorite, editBio} = require('./handlers/users')
const { validateUser } = require('./util/admin')
const { createPost, getAllPosts, getPostsByTopic, getPostsByType, getPostsByUser, getPost, deletePost } = require('./handlers/posts')

//User Routes
app.get('/login', login);
app.get('/callback', callback);
app.post('/createUser', createUser)
app.get('/getUser/:id', getUser)
app.patch('/self', validateUser, getSelf)
app.post('/uploadpic', uploadPic)
app.post('/addFavorite', validateUser, addFavorite)
app.post('/removeFavorite', validateUser, removeFavorite)
app.post('/editBio', validateUser, editBio)
//Post Routes
app.post('/createPost', validateUser, createPost)
app.get('/postsByType/:type', getPostsByType)
app.get('/allPosts', getAllPosts)
app.get('/postsByTopic/:topic', getPostsByTopic)
app.get('/postsByUser/:user', getPostsByUser)
app.get('/post/:postId', getPost)
app.delete('/post/:postId', validateUser, deletePost)

exports.api = functions.https.onRequest(app)