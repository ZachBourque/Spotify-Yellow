const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require("cors")
var querystring = require('querystring');
const bodyParser = require('body-parser')
var info = require('./things.json')
var request = require('request')

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
      favAlbums: []
    }

    admin.firestore().collection('users').add(newUser).then(doc => {
      newUser.firebaseID = doc.id 
      return res.json({user: newUser})
    }).catch((err) =>{
      res.status(500).json({error: 'something went wrong'})
      console.error(err)
    })

  })

  app.post('/uploadpic', (req,res) => {
    admin.storage().bucket().upload(URL.createObjectURL(req.body.image)).then(() => {
      return res.json({success: "success"})
    }).catch(err => {
      console.error(err)
      return res.status(400).json({error: err})
    })
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
              data: body
          }
          console.log(body)
          admin.firestore().collection('users').where('id', "==", body.id).get().then(snap => {
            if(snap.size === 0){
              websitedata.hasAccount = false
            }
            else{
              snap.forEach(snapshot => {
                websitedata.firebaseID = snapshot.id
                websitedata.hasAccount = true
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