import { USERLOADING, SETUSERDATA, CLEARUSERDATA, LOGOUT, REFRESH_TOKEN, UPDATEBIO, LOADTOKEN } from "../types"
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
	axios.post("/editBio", {bio}, {headers:{token, expires, rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: UPDATEBIO, payload: {bio}})
		history.push('/profile')
	})
}

export const getNewToken = (rtoken) => (dispatch) => {
	dispatch({type: LOADTOKEN})
	axios.get('/token', {headers: {rtoken}}).then(res => {
		let lsdata = JSON.parse(localStorage.getItem("data"))
		lsdata.token = res.data.token 
		lsdata.expires = res.data.expires
		localStorage.setItem("data", JSON.stringify(lsdata))
		dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
	})
}