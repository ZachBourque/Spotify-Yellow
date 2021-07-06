import { USERLOADING, SETUSERDATA, CLEARUSERDATA, LOGOUT, REFRESH_TOKEN } from "../types"
import axios from "axios"

const getData = (token, dispatch) => {
	console.log("getting data")
	console.log(token)
	axios.get('https://api.spotify.com/v1/me',{
		headers: { 'Authorization': 'Bearer ' + token },
		json: true
	}).then(res => {
		let id = res.data.id 
		console.log(id)
		axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/getUser/${id}`).then(res => {
			let data = {
				pfp: res.data.profilepic,
				bio: res.data.bio,
				favAlbums: res.data.favAlbums,
				favArtists: res.data.favArtists,
				favSongs: res.data.favSongs,
				id: res.data.id,
				posts: res.data.posts,
				username: res.data.username,
			}
			dispatch({type: SETUSERDATA, payload: data})
			localStorage.setItem("cachepfp", data.pfp)
	})
	}).catch(err => {
		console.error(err)
		if(err?.response?.data?.error){
			dispatch({type: LOGOUT})
			dispatch({type: CLEARUSERDATA})
		}
	})
}

export const loadUser = (token, expires, rtoken) => (dispatch) => {
	console.log("loadUser")
	dispatch({type: USERLOADING})
	let now = new Date().getTime()
	if(now < expires){
		getData(token, dispatch)
	} else {
		console.log("less")
		axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/refreshtoken/${rtoken}`).then(res => {
			let atoken = res.data.access_token
			let exp = new Date(new Date().getTime() + ((res.data.expires_in * 1000)-60000)).getTime()
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = atoken 
			lsdata.expires = exp 
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: atoken, expires: exp}})
			getData(atoken, dispatch)
		})
	}
}

export const reloadUserProfile = (token, expires, rtoken) => (dispatch) => {
	console.log("reloadUserProfile")
	let now = new Date().getTime()
	if(now < expires){
		getData(token, dispatch)
	} else {
		console.log("less")
		axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/refreshtoken/${rtoken}`).then(res => {
			let atoken = res.data.access_token
			let exp = new Date(new Date().getTime() + ((res.data.expires_in * 1000)-60000)).getTime()
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = atoken 
			lsdata.expires = exp 
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: atoken, expires: exp}})
			getData(atoken, dispatch)
		})
	}
}