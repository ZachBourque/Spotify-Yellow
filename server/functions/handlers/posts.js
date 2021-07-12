const {admin, db} = require('../util/admin')

exports.createPost = (req,res) => {
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
    username: req.user.username
  }
  db.collection('posts').add(newPost).then(() => {
	  if(req.auth.refreshed){
		return res.json({success: "Successfully created post.", refreshed: true, expires: req.auth.expires, token: req.auth.token})
	  } else {
		return res.json({success: "Successfully created post."})
	  }
  }).catch(err => {
	console.error(err)
	return res.status(500).json({error: "Error creating post."})
  })
}

exports.getAllPosts = (req,res) => {
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

exports.getPostsByType = (req,res) => {
  const type = req.params.type 
  db.collection('posts').where("type", "==", type).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({...post.data(), id: post.id})
    })
    return res.json({posts})
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPostsByTopic = (req,res) => {
  const topic = req.params.topic 
  db.collection('posts').where("topic", "==", topic).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({...post.data(), id: post.id})
    })
    return res.json({posts})
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPostsByUser = (req,res) => {
  const id = req.params.user
  db.collection('posts').where("id", "==", id).get().then(snap => {
    let posts = []
    snap.forEach(post => {
      posts.push({...post.data(), id: post.id})
    })
    return res.json({posts})
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ error: "Could not get posts." });
  });
}

exports.getPost = (req,res) => {
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if(!doc.exists){
      return res.status(404).json({error: "Could not find post."})
    }
    return res.json({post: {...doc.data(), id: doc.id}})
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Error getting post."})
  })
}

exports.deletePost = (req,res) => {
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if(!doc.exists){
      return res.status(404).json({error: "Could not find post."})
    }
    let post = doc.data()
    if(post.authorid === req.user.id){
      doc.ref.delete().then(() => {
        if(req.auth.refreshed){
          return res.json({success: "Successfully deleted post", refreshed: true, token: req.auth.token, expires: req.auth.expires})
        } else {
          return res.json({success: "Successfully deleted post"})
        }
        // delete comments and likes and stuff
      }).catch(err => {
        console.error(err)
        return res.status(500).json({error: "Error deleting post"})
      })
    } else {
      console.log(post.authorid, req.user.id)
      return res.status(400).json({error: "Post isnt yours lol"})
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Could not get post"})
  })
}

exports.editPost = (req,res) => {
  console.log(req.params.postId)
  db.doc(`/posts/${req.params.postId}`).get().then(doc => {
    if(!doc.exists){
      return res.status(404).json({error: "Post does not exist"})
    }
    if(doc.data().authorid === req.user.id){
      doc.ref.update(req.body.update).then(() => {
        if(req.auth.refreshed){
          return res.json({success: "Successfully edited post", refreshed: true, token: req.auth.token, expires: req.auth.expires})
        } else {
          return res.json({success: "Successfully edited post", doc: {...doc.data(), ...req.body.update}})
        }
      }).catch(err => {
        console.error(err)
        return res.status(500).json({error: "Error updating post."})
      })
    } else {
      return res.status(403).json({error: "post isnt yours lol"})
    }
  }).catch(err => {
    console.error(err)
    return res.status(500).json({error: "Error getting post"})
  })
}