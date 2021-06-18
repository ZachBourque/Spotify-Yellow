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
    var state = req.query.state || null;

    res.redirect("http://localhost:3000/temp?" + querystring.stringify({code: code, state: state}))

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
      createdAt: new Date().toISOString()
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
      author: req.body.author,
      authorid: req.body.authorid,
      pfp: req.body.pfp,
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
      spotifyID: req.body.spotifyID,
    }
    admin.firestore().collection('posts').add(newPost).then(doc => {
      newPost.firebaseID = doc.id 
      return res.json({post: newPost})
    }).catch((err) =>{
      res.status(500).json({error: 'something went wrong'})
      console.error(err)
    })
  })

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
        user = obj
      })
      return res.json({user: user})
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

exports.api = functions.https.onRequest(app)