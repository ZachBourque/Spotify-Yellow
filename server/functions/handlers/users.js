const { admin, db, client_secret } = require('../util/admin')
const request = require("request");

const querystring = require('querystring')
var redirect_uri = 'http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback'; // Your redirect uri
var client_id = "e5f1276d07b74135956c8b3130f79f3f"; // Your client id

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

exports.login = (req,res) => {
	//remove state??
	var state = generateRandomString(16);
	var redirect_uri = 'http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback'; // Your redirect uri
	var client_id = "e5f1276d07b74135956c8b3130f79f3f" 

	// your application requests authorization
	var scope = 'user-read-private user-read-email user-read-playback-state';
	return res.json({url: 'https://accounts.spotify.com/authorize?' + querystring.stringify({
		response_type: 'code',
		client_id: client_id,
		scope: scope,
		redirect_uri: redirect_uri,
		state: state
	}), state: state});
}

exports.callback = (req,res) => {

  console.log("/callback")
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
        db.collection('users').where('id', "==", body.id).get().then(snap => {
          if(snap.size === 0){
            websitedata.a = false
          }
          else{
            snap.forEach(snapshot => {
              websitedata.a = true
              websitedata.p = snapshot.data().profilepic
            })
          }
        return res.redirect("http://localhost:3000/temp?"+querystring.stringify(websitedata))
        })
      });
    } else {
      console.log(error)
      return res.status(500).json({error: "Something went wrong."})
    }
  });

}

exports.createUser = (req,res) => {
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

  db.collection('users').add(newUser).then(doc => {
    newUser.firebaseID = doc.id 
    return res.json(newUser)
  }).catch((err) =>{
    console.error(err)
    return res.status(500).json({error: 'something went wrong'})
  })
}

exports.getUser = (req,res) => {
  db.collection('users').where('id', '==', req.params.id).limit(1).get().then(snap => {
    if(!snap.docs[0].exists){
      return res.status(404).json({error: "Could not find user."})
    }
    let user = snap.docs[0].data()
    return db.collection('posts').where('authorid', '==', user.id).get().then(posts => {
      user.posts = []
      posts.forEach(post => {
        user.posts.push({...post.data(), postId: post.id})
      })
      return res.json(user)
    })
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Could not get data."})
  })
}

exports.getSelf = (req,res) => {
  db.collection('posts').where('authorid', '==', req.user.id).get().then(snap => {
    req.user.posts = []
    snap.forEach(doc => {
      req.user.posts.push({...doc.data(), postId: doc.id})
    })
    return db.collection('likes').where('authorid', '==', req.user.id).get()
  }).then(snap => {
    req.user.likes = []
    snap.forEach(doc => {
      req.user.likes.push(doc.data())
    })
    if(req.auth.refreshed){
      return res.json({success: "Successfully got user", refreshed: true, token: req.auth.token, expires: req.auth.expires, user: req.user})
    } else {
      return res.json({success: "Successfully got user", user: req.user})
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Internal server error"})
  })
}

exports.uploadPic = (req,res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const { uuid } = require("uuidv4");
  const fs = require("fs");
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
}

exports.editFavorites = (req,res) => {
  //validate probably lol
  console.log(req.body)
  req.userRef.update(req.body.update).then(() => {
    return res.json({success: "Success"})
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Could not update user"})
  })
}

exports.editBio = (req,res) => {
  //validate first
  req.userRef.update({bio: req.body.bio}).then(() => {
     return res.json({success: "Successfully updated bio"})
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Failed to update bio"})
  })
}

exports.updatePfp = (req,res) => {
  let image = req.body.url 
  req.userRef.update({profilepic: image}).then(() => {
    return res.json({success: "Successfully updated bio"})
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Failed to update pfp"})
  })
}

exports.getToken = (req,res) => {
  var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
			form: {
				grant_type: 'refresh_token',
				refresh_token: req.headers.rtoken
			},
			json: true
		};
		request.post(authOptions, function(error, response, body){
			if(error || response.statusCode !== 200){
				error ? console.error(error) : null
				return res.status(401).json({error: "Error getting refresh token, LOGOUT"})
			} else {
        return res.json({token: body.access_token, expires: new Date(new Date().getTime() + ((body.expires_in * 1000)-60000)).getTime()})
			}
		})
}

exports.getUsers = (req,res) => {
  db.collection('users').get().then(snap => {
    let users = []
    snap.forEach(user => {
      users.push(user.data())
    })
    return res.json({users})
  })
}