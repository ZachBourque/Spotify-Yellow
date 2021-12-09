const {admin, db, client_secret, Return} = require("../util/admin")
const request = require("request")

const querystring = require("querystring")
const {validateUser, validateBio, validateFavorites, validateUsername} = require("../util/validators")
var client_id = "e5f1276d07b74135956c8b3130f79f3f" // Your client id

let url = "https://spotify-yellow-282e0.web.app/"
//let url = "http://localhost:3000/"
var redirect_uri = "https://us-central1-spotify-yellow-282e0.cloudfunctions.net/api/callback" // Your redirect uri
//var redirect_uri = "http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback"

var generateRandomString = function (length) {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

exports.login = (req, res) => {
  //remove state??
  var state = generateRandomString(16)
  var client_id = "e5f1276d07b74135956c8b3130f79f3f"

  console.log(redirect_uri)
  // your application requests authorization
  var scope = "user-read-private user-read-email user-read-playback-state"
  return res.json({
    url:
      "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }),
    state: state
  })
}

exports.callback = (req, res) => {
  console.log("/callback")
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token,
        expires_in = body.expires_in

      var options = {
        url: "https://api.spotify.com/v1/me",
        headers: {Authorization: "Bearer " + access_token},
        json: true
      }

      // use the access token to access the Spotify Web API
      request.get(options, function (error, response, body) {
        let websitedata = {
          t: access_token,
          rt: refresh_token,
          ex: new Date(new Date().getTime() + (expires_in * 1000 - 60000)).getTime(),
          id: body.id
        }
        db.collection("users")
          .where("id", "==", body.id)
          .get()
          .then(snap => {
            if (snap.size === 0) {
              websitedata.a = false
            } else {
              snap.forEach(snapshot => {
                websitedata.a = true
                websitedata.p = snapshot.data().profilepic
              })
            }
            console.log(url)
            return res.redirect(url + "temp?" + querystring.stringify(websitedata))
          })
      })
    } else {
      console.log(error)
      return res.redirect(url + "temp?" + querystring.stringify({error}))
    }
  })
}

exports.createUser = (req, res) => {
  let newUser = {
    username: req.body.username,
    profilepic: req.body.profilepic,
    bio: "",
    favArtists: [],
    favSongs: [],
    favAlbums: [],
    createdAt: new Date().toISOString(),
    posts: []
  }

  let errors = validateUser(newUser)
  if (errors.length > 0) {
    return res.status(400).json({error: "Invalid user.", errors})
  }

  var options = {
    url: "https://api.spotify.com/v1/me",
    headers: {Authorization: "Bearer " + req.auth.token},
    json: true
  }

  request.get(options, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      error ? console.error(error) : null
      return res.status(401).json({error: "Error getting spotify data", logout: true})
    } else {
      newUser.id = body.id
      db.collection("users")
        .add(newUser)
        .then(doc => {
          newUser.firebaseID = doc.id
          return res.json(newUser)
        })
        .catch(err => {
          console.error(err)
          return res.status(500).json({error: "something went wrong"})
        })
    }
  })
}

exports.getUser = (req, res) => {
  console.log("/getUser")
  db.collection("users")
    .where("id", "==", req.params.id)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get()
    .then(snap => {
      if (snap.docs.length === 0) {
        return res.status(404).json({error: "Could not find user."})
      }
      let user = snap.docs[0].data()
      return db
        .collection("posts")
        .where("authorid", "==", user.id)
        .orderBy("createdAt", "desc")
        .limit(100)
        .get()
        .then(posts => {
          user.posts = []
          posts.forEach(post => {
            user.posts.push({...post.data(), postId: post.id})
          })
          return res.json(user)
        })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Could not get data."})
    })
}

exports.getSelf = (req, res) => {
  console.log("/getSelf")
  db.collection("posts")
    .where("authorid", "==", req.user.id)
    .orderBy("createdAt", "desc")
    .get()
    .then(snap => {
      req.user.posts = []
      snap.forEach(doc => {
        req.user.posts.push({...doc.data(), postId: doc.id})
      })
      return db.collection("likes").where("authorid", "==", req.user.id).get()
    })
    .then(snap => {
      req.user.likes = []
      snap.forEach(doc => {
        req.user.likes.push(doc.data())
      })
      return db.collection("notifications").where("receiver", "==", req.user.id).orderBy("createdAt", "desc").limit(20).get()
    })
    .then(data => {
      req.user.notifications = []
      data.forEach(doc => req.user.notifications.push({...doc.data(), notificationId: doc.id}))
      return Return(req, res, {user: req.user})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Internal server error"})
    })
}

exports.uploadPic = (req, res) => {
  const BusBoy = require("busboy")
  const path = require("path")
  const os = require("os")
  const {uuid} = require("uuidv4")
  const fs = require("fs")
  const busboy = new BusBoy({headers: req.headers})

  let imageToBeUploaded = {}
  let imageFileName
  let generatedToken = uuid()

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({error: "Wrong file type submitted"})
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1]
    // 32756238461724837.png
    imageFileName = generateRandomString(20) + "." + imageExtension
    const filepath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = {filepath, mimetype}
    file.pipe(fs.createWriteStream(filepath))
  })
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            firebaseStorageDownloadTokens: generatedToken
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/${imageFileName}?alt=media&token=${generatedToken}`
        return res.json({url: imageUrl})
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: "something went wrong"})
      })
  })
  busboy.end(req.rawBody)
}

exports.editFavorites = (req, res) => {
  let errors = validateFavorites(req.body.update)
  if (errors.length > 0) {
    return res.status(400).json({error: "Invalid favorite list", errors})
  }
  req.userRef
    .update(req.body.update)
    .then(() => {
      return Return(req, res, {})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Could not update user"})
    })
}

exports.editBio = (req, res) => {
  let error = validateBio(req.body.bio)
  if (error) {
    return res.status(400).json({error})
  }
  req.userRef
    .update({bio: req.body.bio})
    .then(() => {
      return Return(req, res, {})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Failed to update bio"})
    })
}

exports.updateUsername = (req, res) => {
  let error = validateUsername(req.body.username)
  if (error) return res.status(400).json({error})
  req.userRef
    .update({username: req.body.username})
    .then(() => {
      return Return(req, res, {})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Failed to update username"})
    })
}

exports.updatePfp = (req, res) => {
  let image = req.body.url
  if (!image.startsWith("https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/")) {
    return res.status(400).json({error: "Invalid image url"})
  }
  req.userRef
    .update({profilepic: image})
    .then(() => {
      return Return(req, res, {url: image})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Failed to update pfp"})
    })
}

exports.getToken = (req, res) => {
  console.log("/getToken")
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {Authorization: "Basic " + new Buffer(client_id + ":" + client_secret).toString("base64")},
    form: {
      grant_type: "refresh_token",
      refresh_token: req.headers.rtoken
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      error ? console.error(error) : null
      return res.status(401).json({error: "Error getting refresh token", logout: true})
    } else {
      return res.json({token: body.access_token, expires: new Date(new Date().getTime() + (body.expires_in * 1000 - 60000)).getTime()})
    }
  })
}

exports.getUsers = (req, res) => {
  console.log("/getUsers")
  db.collection("users")
    .get()
    .then(snap => {
      let users = []
      snap.forEach(user => {
        users.push(user.data())
      })
      return res.json({users})
    })
}

exports.markNotificationsRead = (req, res) => {
  console.log("/markNotiRead")
  let batch = db.batch()
  req.body.forEach(id => {
    const notification = db.doc(`/notifications/${id}`)
    batch.update(notification, {read: true})
  })
  batch
    .commit()
    .then(() => {
      return Return(req, res, {})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error committing batch."})
    })
}

exports.sendNotification = (req, res) => {
  let notification = {
    createdAt: new Date().toISOString(),
    type: "send",
    read: false,
    sender: req.user.id,
    senderName: req.user.username,
    receiver: req.body.receiveId
  }
  console.log(req.body.type, req.body.id)
  var options = {
    url: `https://api.spotify.com/v1/${req.body.type}s/${req.body.id}`,
    json: true
  }
  request.get(options, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      error ? console.error(error) : null
      return res.status(400).json({error: "Could not get spotify data"})
    } else {
      console.log(error)
      notification.pic = body.images[0].url
      notification.postId = body.href
      db.collection("notifications")
        .add(notification)
        .then(() => {
          return Return(req, res, {})
        })
        .catch(err => {
          console.error(err)
          return res.status(500).json({error: "Error adding notification"})
        })
    }
  })
}
