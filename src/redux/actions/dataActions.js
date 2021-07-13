import { DATALOADING, SETFEEDDATA, DELETEPOST, EDITPOST, REFRESH_TOKEN } from '../types'
import axios from "axios"

export const getFeedData = () => (dispatch) => {
	dispatch({type: DATALOADING})
	axios.get('/allPosts').then(res => { 
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
  
}

export const reloadFeedData = () => (dispatch) => {
	axios.get('/allPosts').then(res => {
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
}

export const editPost = (postId, update, token, expires, rtoken) => (dispatch) => {
        axios.put(`/editPost/${postId}`, update, { headers: { token, expires, rtoken } }).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: EDITPOST, payload: {id: postId, changes: update.update}})
	})
}

export const deletePost = (postId, token, expires, rtoken) => (dispatch) => {
	axios.delete(`/post/${postId}`, { headers: { token, expires, rtoken } }).then(res => { 
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: DELETEPOST, payload: {id: postId}})
	})

}


