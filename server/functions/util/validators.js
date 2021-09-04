const allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ1234567890-._"
const allowedPunctuation = "._-"

const request = require("request")

function isEmpty(string) {
  return !string || 0 === string.length.trim()
}

exports.validatePost = post => {
  let errors = []
  if (post.type !== "artist" && post.type !== "track" && post.type !== "album") {
    errors.push("Invalid post type.")
  }

  if (isEmpty(post.body)) {
    errors.push("Body cannot be empty")
  } else if (post.body.length > 15000) {
    errors.push("Body cannot be longer than 15000 characters")
  }

  if (post.type === "artist" && (!post.artist || post.album || post.track)) {
    errors.push("Invalid params for post type artist")
  }

  if (post.type === "album" && (!post.artist || !post.album || post.track)) {
    errors.push("Invalid params for post type album")
  }

  if (post.type === "track" && (!post.artist || !post.album || !post.track)) {
    errors.push("Invalid params for post type track")
  }

  if (isEmpty(post.title)) {
    errors.push("Title cannot be empty")
  } else if (post.title.length > 50) {
    errors.push("Title cannot be longer than 50 characters.")
  }

  if (post.rating !== null) {
    if (!Number.isInteger(post.rating) || post.rating > 10 || post.rating < 0) {
      errors.push("Invalid rating")
    }
  }

  return errors
}

exports.validateComment = comment => {
  let errors = []
  if (isEmpty(comment.body)) {
    errors.push("Comment body cannot be empty")
  } else if (comment.body.length > 2000) {
    errors.push("Comment cannot be longer than 2000 characters.")
  }

  return errors
}

exports.validatePostEdit = update => {
  let errors = []
  let newUpdate = {}

  if (update.body) {
    if (isEmpty(update.body)) {
      errors.push("Body cannot be empty")
    } else if (update.body.length > 15000) {
      errors.push("Body cannot be longer than 15000 characters")
    } else {
      newUpdate.body = update.body
    }
  }

  if (update.rating !== undefined) {
    if (update.rating !== null) {
      if (!Number.isInteger(update.rating) || update.rating > 10 || update.rating < 0) {
        errors.push("Invalid rating")
      } else {
        newUpdate.rating = update.rating
      }
    } else {
      newUpdate.rating = null
    }
  }

  if (update.title) {
    if (isEmpty(update.title)) {
      errors.push("Title cannot be empty")
    } else if (update.title.length > 50) {
      errors.push("Title cannot be longer than 50 characters")
    } else {
      newUpdate.title = update.title
    }
  }

  return {update: newUpdate, errors}
}

exports.validateUser = user => {
  let errors = []
  if (isEmpty(user.username)) {
    errors.push("Invalid username")
  } else if (user.username.length > 20) {
    errors.push("Username cannot be longer than 20 characters")
  } else {
    if (allowedPunctuation.includes(user.username.charAt(0))) {
      errors.push("Username cannot start with punctuation")
    }
    let i = user.username.length
    while (i--) {
      if (!allowedCharacters.includes(user.username.charAt(i))) {
        errors.push("User contains invalid characters")
        break
      }
    }
  }
  if (user.profilepic === "default") {
    user.profilepic = "https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/ABU1Xn6_d.png?alt=media"
  } else if (!user.profilepic.startsWith("https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/")) {
    errors.push("Invalid profile picture")
  }

  return errors
}

exports.validateBio = bio => {
  if (isEmpty(bio)) {
    return "Invalid bio"
  } else if (bio.length > 300) {
    return "Bio cannot be longer than 300 characters"
  } else {
    return null
  }
}

exports.validateFavorites = favorites => {
  let errors = []

  if (Array.isArray(favorites.favArtists)) {
    if (favArtists.length > 3) {
      errors.push("Too many favorite artists")
    } else {
      for (let i = 0; i < favArtists.length; i++) {
        if (!(favArtists[i].name && favArtists[i].pic && favArtists[i].url)) {
          errors.push(`Invalid artist object at index ${i}`)
          break
        }
      }
    }
  }
  if (Array.isArray(favorites.favAlbums)) {
    if (favAlbums.length > 3) {
      errors.push("Too many favorite albums")
    } else {
      for (let i = 0; i < favAlbums.length; i++) {
        if (!(favAlbums[i].name && favAlbums[i].pic && favAlbums[i].url)) {
          errors.push(`Invalid album object at index ${i}`)
          break
        }
      }
    }
  }
  if (Array.isArray(favorites.favTracks)) {
    if (favTracks.length > 3) {
      errors.push("Too many favorite tracks")
    } else {
      for (let i = 0; i < favTracks.length; i++) {
        if (!(favTracks[i].name && favTracks[i].pic && favTracks[i].url)) {
          errors.push(`Invalid tracks object at index ${i}`)
          break
        }
      }
    }
  }

  return errors
}
