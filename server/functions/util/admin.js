const functions = require('firebase-functions')
const admin = require('firebase-admin')
const request = require('request')

admin.initializeApp()
const client_secret = functions.config().info.client_secret 
const db = admin.firestore()

const validateUser = (req,res,next) => {
	const getUser = () => {

		var options = {
		url: 'https://api.spotify.com/v1/me',
		headers: { 'Authorization': 'Bearer ' + req.body.token },
		json: true
		};
	
		request.get(options, function(error, response, body){
			if(error || response.statusCode !== 200){
				error ? console.error(error) : null
				return res.status(401).json({error: "Error getting spotify data, LOGOUT"})
			} else {
				db.collection('users').where('id', '==', body.id).limit(1).get().then(snap => {
					req.user = {...snap.docs[0].data()}
					req.user.refreshed = true
					req.user.token = req.body.token 
					req.user.expires = req.body.expires
					return next()
				}).catch(err => {
					console.error(err)
					return res.status(500).json({errro: "Error getting user data, LOGOUT"})
				})
			}
		})

	}
	let { expires, token, rtoken } = req.body
	let now = new Date().getTime()
	if(now < expires){
		getUser()
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
				req.body.token = body.access_token
				req.body.expires = new Date(new Date().getTime() + ((body.expires_in * 1000)-60000)).getTime()
				getUser()
			}
		})
	}

}

module.exports = { client_secret, db, admin, validateUser}