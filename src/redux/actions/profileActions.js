import axios from "axios"
import { SETPROFILEDATA, PROFILELOADING } from "../types"

export const getProfileData = (id) => (dispatch) => {
	console.log("getProfileData")
	dispatch({type: PROFILELOADING})
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
		}
		dispatch({type: SETPROFILEDATA, payload: data})
	})
}