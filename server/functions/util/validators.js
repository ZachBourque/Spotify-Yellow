const { ExposurePlus1Outlined } = require("@material-ui/icons");
const { post } = require("request");

function isEmpty(string){
    return (!string || 0 === string.length.trim());
}

exports.validatePost = (post) => {
	let errors = []
	if(post.type !== "artist" && post.type !== "track" && post.type !== "album"){
		errors.push("Invalid post type.")
	}

	if(isEmpty(post.body)){
		errors.push("Body cannot be empty")
	}

	else if(post.body.length > 15000){
		errors.push("Body cannot be longer than 15000 characters")
	}

	if(post.type === "artist" && (!post.artist || post.album || post.track)){
		errors.push("Invalid params for post type artist")
	}

	if(post.type === "album" && (!post.artist || !post.album || post.track)){
		errors.push("Invalid params for post type album")
	}

	if(post.type === "track" && (!post.artist || !post.album || !post.track)){
		errors.push("Invalid params for post type track")
	}
	
	if(isEmpty(post.title)){
		errors.push("Title cannot be empty")
	}

	else if(post.title.length > 50){
		errors.push("Title cannot be longer than 50 characters.")
	}

	if(post.rating !== null){
		if(!Number.isInteger(post.rating) || post.rating > 10 || post.rating < 0){
			errors.push("Invalid rating")
		}
	}

	return errors

}

exports.validateComment = (comment) => {
	let errors = []
	if(isEmpty(comment.body)){
		errors.push("Comment body cannot be empty")
	} else if(comment.body.length > 2000){
		errors.push("Comment cannot be longer than 2000 characters.")
	}

	return errors
}

exports.validatePostEdit = (update) => {
	let errors = []
	let newUpdate = {}

	if(update.body){
		if(isEmpty(update.body)){
			errors.push("Body cannot be empty")
		} else if(update.body.length > 15000){
			errors.push("Body cannot be longer than 15000 characters")
		} else {
			newUpdate.body = update.body
		}
	}

	if(update.rating !== undefined){
		if(update.rating !== null){
			if(!Number.isInteger(update.rating) || update.rating > 10 || update.rating < 0){
				errors.push("Invalid rating")
			} else {
				newUpdate.rating = update.rating
			}
		} else {
			newUpdate.rating = null
		}
	}

	if(update.title){
		if(isEmpty(update.title)){
			errors.push("Title cannot be empty")
		} else if(update.title.length > 50){
			errors.push("Title cannot be longer than 50 characters")
		} else {
			newUpdate.title = update.title
		}
	}
	
	return {update: newUpdate, errors}

}
