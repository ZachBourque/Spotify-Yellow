const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require("cors")
var querystring = require('querystring');
var info = require('./things.json')
var request = require('request')

const { v4: uuid } = require("uuid");
const BusBoy = require('busboy')
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

var client_id = info.id; // Your client id
var client_secret = info.secret; // Your secret
var redirect_uri = 'http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback'; // Your redirect uri

const express = require('express');
const { _onRequestWithOptions } = require('firebase-functions/lib/providers/https');
const app = express();
app.use(cors())

admin.initializeApp()

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

var stateKey = 'spotify_auth_state';

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    
    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-playback-state';
    res.json({url: 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }), state: state});
  });
  
  app.get('/callback', function(req, res) {
  
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token,
            expires_in = body.expires_in;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          let websitedata = {
              t: access_token,
              rt: refresh_token,
              ex: new Date(new Date().getTime() + ((expires_in * 1000)-60000)).getTime(),
              id: body.id
          }
          admin.firestore().collection('users').where('id', "==", body.id).get().then(snap => {
            if(snap.size === 0){
              websitedata.a = false
            }
            else{
              snap.forEach(snapshot => {
                websitedata.a = true
                websitedata.p = snapshot.data().profilepic
              })
            }
          res.redirect("http://localhost:3000/temp?"+querystring.stringify(websitedata))
          })
        });
      } else {
        console.log(error)
        res.status(500).json({error: "Something went wrong."})
      }
    });

  });

  app.post('/createUser', (req, res) => {
    let newUser = {
      id: req.body.id,
      username: req.body.username,
      profilepic: req.body.profilepic,
      bio: "",
      favArtists: [],
      favSongs: [],
      favAlbums: [],
      createdAt: new Date().toISOString(),
      posts: []
    }

    admin.firestore().collection('users').add(newUser).then(doc => {
      newUser.firebaseID = doc.id 
      return res.json(newUser)
    }).catch((err) =>{
      res.status(500).json({error: 'something went wrong'})
      console.error(err)
    })

  })

  app.post('/createPost', (req,res) => {
    let newPost = {
      type: req.body.type,
      body: req.body.body,
      album: req.body.album,
      artist: req.body.artist,
      song: req.body.song,
      title: req.body.title,
      topic: req.body.topic,
      pic: req.body.pic,
      createdAt: new Date().toISOString(),
      rating: req.body.rating,
      spotifyid: req.body.spotifyid
    }
    testToken(req.body.token, req.body.rtoken, req.body.expires, createPost, res, newPost) 
  })

  function createPost(data){
    let { token, refreshed, expires, res } = data
    let newPost = data.data
    var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + token },
      json: true
    };
 
    request.get(options, function(error, response, body){
      if(error || response.statusCode !== 200){
        error ? console.error(error) : null
        return res.status(401).json({error: "Error getting access token, LOGOUT"})
      } else {
        let id = body.id 
        admin.firestore().collection("users").where("id", "==", id).get().then(snap => {
          if(snap.size === 1){
            snap.forEach(user => {
              newPost.authorid = id
              newPost.pfp = user.data().profilepic
              newPost.username = user.data().username
              admin.firestore().collection("posts").add(newPost).then(post => {
                newPost.id = post.id
                user.ref.update({
                  posts: admin.firestore.FieldValue.arrayUnion(newPost)
                }).then(() => {
                  if(refreshed){
                    return res.json({success: "Successfully created post!", refreshed: true, expires, token})
                  } else {
                    return res.json({success: "Successfully created post!", refreshed: false})
                  }
                }).catch(err => {
                  console.error(err)
                  return res.status(500).json({error: "Error updating user posts array."})
                })
              }).catch(err => {
                console.error(err)
                return res.status(500).json({error: "Error adding post."})
              })
            })

          } else {
            return res.status(401).json({error: "Could not find user."})
          }
        }).catch(err => {
          console.error(err)
          return res.status(500).json({error: "Error getting user."})
        })
      }
    })

  }

  app.get('/postsByType/:type', (req,res) => {
    const type = req.params.type 
    admin.firestore().collection('posts').where("type", "==", type).get().then(snap => {
      let posts = []
      snap.forEach(post => {
        posts.push(post)
      })
      return res.json({posts: posts})
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
  })

  app.get('/allPosts', (req,res) => {
    admin.firestore().collection('posts').get().then(snap => {
      let posts = []
      snap.forEach(post => {
        posts.push(post.data())
      })
      return res.json(posts)
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
  })

  app.get('/postsByTopic/:topic', (req,res) => {
    const topic = req.params.topic 
    admin.firestore().collection('posts').where("topic", "==", topic).get().then(snap => {
      let posts = []
      snap.forEach(post => {
        posts.push(post)
      })
      return res.json({posts: posts})
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
  })

  app.get('/getUser/:id', (req,res) => {
    const id = req.params.id 
    admin.firestore().collection('users').where('id', "==", id).get().then(snap => {
      let user
      snap.forEach(obj => {
        user = obj.data()
      })
      return res.json(user)
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
  })

  app.get('/postsByUser/:user', (req,res) => {
    const user = req.params.user 
    admin.firestore().collection('posts').where("id", "==", user).get().then(snap => {
      let posts = []
      snap.forEach(post => {
        posts.push(post)
      })
      return res.json({posts: posts})
    }).catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "something went wrong" });
    });
  })

  app.get('/refreshtoken/:token', (req,res) => {
    var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.params.token
    },
    json: true
  };
  request.post(authOptions, function(error, response, body){
    if(error || response.statusCode !== 200){
      error ? console.error(err) : null 
      res.status(401).json({error: "Could not refresh token, LOGOUT"})
    } else {
      res.json(body)
    }
  })
  })

  app.post('/uploadpic', (req,res) => {
    
    const busboy = new BusBoy({ headers: req.headers });

    let imageToBeUploaded = {};
    let imageFileName;
    let generatedToken = uuid();

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({ error: "Wrong file type submitted" });
      }
      // my.image.png => ['my', 'image', 'png']
      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      // 32756238461724837.png
      imageFileName = generateRandomString(20) + "." + imageExtension
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
      admin.storage().bucket().upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype,
              firebaseStorageDownloadTokens: generatedToken,
            },
          },
        }).then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/${imageFileName}?alt=media&token=${generatedToken}`;
          return res.json({url: imageUrl})
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: "something went wrong" });
        });
    });
    busboy.end(req.rawBody);

  })

  app.get('/getUserData/:code', (req, res) => {
    const code = req.params.code
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          let websitedata = {
              token: access_token,
              spotifyData: body
          }
          admin.firestore().collection('users').where('id', "==", body.id).get().then(snap => {
            if(snap.size === 0){
              websitedata.hasAccount = false
            }
            else{
              snap.forEach(snapshot => {
                websitedata.firebaseData = snapshot.data()
                websitedata.firebaseID = snapshot.id
                websitedata.hasAccount = true
                websitedata.pfp = snapshot.profilepic
              })
            }
            return res.json(websitedata)
          })
        });

        // we can also pass the token to the browser to make requests from there
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  })

function testToken(token, rtoken, expires, callback, res, data){
  let now = new Date().getTime()
  if(now < expires){
    callback({token, refreshed: false, expires, res, data})
  } else {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: rtoken
    },
    json: true
  };
  request.post(authOptions, function(error, response, body){
    if(error || response.statusCode !== 200){
      error ? console.error(error) : null
      return res.status(401).json({error: "Error getting refresh token, LOGOUT"})
    } else {
      let atoken = body.access_token
      let exp = new Date(new Date().getTime() + ((body.expires_in * 1000)-60000)).getTime()
      callback({token: atoken, refreshed: true, expires: exp, res, data})
    }
  })
  }
}

exports.api = functions.https.onRequest(app)