import { USERLOADING, SETUSERDATA, CLEARUSERDATA, LOGOUT, REFRESH_TOKEN, UPDATEBIO, UPDATEPFP, UPDATEFAVORITES, MARKNOTIFICATIONSREAD } from "../types"
import axios from "axios"

const getData = (token, expires, rtoken, dispatch) => {
	console.log("getting data")
	//patch request cringe
	axios.get('/self', {headers: {token, expires, rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: SETUSERDATA, payload: res.data.user})
	}).catch(err => {
		console.log(err?.response?.data?.error)
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
	axios.post("/editBio", {bio}, {headers:{token, expires, rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: UPDATEBIO, payload: {bio}})
	})
}

export const editFavorites = (update, token, expires, rtoken) => (dispatch) => {
	axios.post("/editFavorites", {update}, {headers: {token, expires, rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: UPDATEFAVORITES, payload: update})
	})
}

export const updateProfilePic = (token, expires, rtoken, formData) => (dispatch) => {
	axios.post('/uploadPic', formData).then(res1 => {
		axios.put('/updatePfp', {url: res1.data.url}, {headers: {token,expires,rtoken}}).then(res => {
			if(res.data.refreshed){
				let lsdata = JSON.parse(localStorage.getItem("data"))
				lsdata.token = res.data.token 
				lsdata.expires = res.data.expires
				localStorage.setItem("data", JSON.stringify(lsdata))
				dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
			}
			dispatch({type: UPDATEPFP, payload: {pfp: res1.data.url}})
		}).catch(err => {
			console.error(err)
		})
	}).catch(err => {
		console.error(err)
	})
}

export const markNotificationsRead = (notifications, token, expires, rtoken) => (dispatch) => {
	axios.post("/notificationsMarkRead", notifications,{headers: {token,expires,rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: MARKNOTIFICATIONSREAD})
	})
}