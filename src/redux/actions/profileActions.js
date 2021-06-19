import axios from "axios"
import { SETPROFILEDATA, SETUSERDATA} from "../types"

export const getUserProfileData = (token, expires, rtoken, history) => (dispatch) => {
	let getData = (token) => {
		axios.get('https://api.spotify.com/v1/me',{
			headers: { 'Authorization': 'Bearer ' + token },
			json: true
		}).then(res => {
			let id = res.data.id 
			axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/getUser/${id}`).then(res => {
				let data = {
					pfp: res.data.profilepic,
					bio: res.data.bio,
					favAlbums: res.data.favAlbums,
					favArtists: res.data.favArtists,
					favSongs: res.data.favSongs,
					id: res.data.id,
					posts: res.data.post,
					username: res.data.username,
					self: true,
					loading: false
				}
				dispatch({type: SETPROFILEDATA, payload: data})
				history.push(`/profile=${id}`)
		})
	}).catch(err => {
		console.error(err)
	})
	}
	let now = new Date().getTime()
	if(now < expires){
		getData(token)
	} else {
		axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/refreshtoken/${rtoken}`).then(res => {
			let atoken = res.data.access_token
			let exp = new Date(new Date().getTime() + ((res.data.expires_in * 1000)-60000)).getTime()
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = atoken 
			lsdata.expires = exp 
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: SETUSERDATA, payload: lsdata})
			getData(atoken)
		})
	}
	
}

export const getProfileData = (id) => (dispatch) => {
	axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/getUser/${id}`).then(res => {
		let data = {
			pfp: res.data.profilepic,
			bio: res.data.bio,
			favAlbums: res.data.favAlbums,
			favArtists: res.data.favArtists,
			favSongs: res.data.favSongs,
			id: res.data.id,
			posts: res.data.post,
			username: res.data.username,
			self: false,
			loading: false
		}
		dispatch({type: SETPROFILEDATA, payload: data})
	})
}