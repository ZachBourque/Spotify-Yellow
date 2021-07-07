import { USERLOADING, SETUSERDATA, CLEARUSERDATA, LOGOUT, REFRESH_TOKEN, UPDATEBIO } from "../types"
import axios from "axios"

const getData = (token, expires, rtoken, dispatch) => {
	console.log("getting data")
	//patch request cringe
	axios.patch('http://localhost:5000/spotify-yellow-282e0/us-central1/api/self', {token, expires, rtoken}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: SETUSERDATA, payload: res.data.user})
	}).catch(err => {
		console.log(err.response.data.error)
	})
}

export const loadUser = (token, expires, rtoken) => (dispatch) => {
	console.log("loadUser")
	dispatch({type: USERLOADING})
	getData(token, expires, rtoken, dispatch)

}

export const reloadUserProfile = (token, expires, rtoken) => (dispatch) => {
	console.log("reloadUserProfile")
	getData(token, expires, rtoken, dispatch)
}

export const editBio = (bio, token, expires, rtoken, history) => (dispatch) => {
	axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/editBio", {bio, token, expires, rtoken}).then(res => {
		dispatch({type: UPDATEBIO, payload: {bio}})
		history.push('/profile')
	})
}