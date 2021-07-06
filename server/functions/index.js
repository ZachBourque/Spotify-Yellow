const functions = require('firebase-functions');
var cors = require("cors")
var querystring = require('querystring');
var request = require('request')

const { v4: uuid } = require("uuid");
const BusBoy = require('busboy')
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

var client_id = "e5f1276d07b74135956c8b3130f79f3f"; // Your client id

const express = require('express');
const app = express();
app.use(cors())

const { login, callback, createUser, getUser, refreshToken, uploadPic } = require('./handlers/users')
const { validateUser } = require('./util/admin')
const { createPost, getAllPosts, getPostsByTopic, getPostsByType, getPostsByUser, getPost} = require('./handlers/posts')

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

//User Routes
app.get('/login', login);
app.get('/callback', callback);
app.post('/createUser', createUser)
app.get('/getUser/:id', getUser)
app.get('/refreshtoken/:token', refreshToken)
app.post('/uploadpic', uploadPic)
//Post Routes
app.post('/createPost', validateUser, createPost)
app.get('/postsByType/:type', getPostsByType)
app.get('/allPosts', getAllPosts)
app.get('/postsByTopic/:topic', getPostsByTopic)
app.get('/postsByUser/:user', getPostsByUser)
app.get('/post/:postId', getPost)


exports.api = functions.https.onRequest(app)