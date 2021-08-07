import { DATALOADING, SETFEEDDATA, DELETEPOST, EDITPOST, REFRESH_TOKEN, SETCOMMENTLIST, LIKEPOST, UNLIKEPOST, SETCURRENT, DELETECOMMENT} from '../types'
import axios from "axios"

export const getFeedData = () => (dispatch) => {
	dispatch({ type: DATALOADING })
	axios.get('/allPosts').then(res => {
		dispatch({ type: SETFEEDDATA, payload: res.data })
	})

}

export const reloadFeedData = () => (dispatch) => {
	axios.get('/allPosts').then(res => {
		dispatch({ type: SETFEEDDATA, payload: res.data })
	})
}

export const setCurrent = (arr) => (dispatch) => {
	dispatch({type: SETCURRENT, payload: arr})
}

export const setDataLoading = () => (dispatch) => {
	dispatch({type: DATALOADING})
}

export const editPost = (postId, update, token, expires, rtoken) => (dispatch) => {
	axios.put(`/editPost/${postId}`, update, { headers: { token, expires, rtoken } }).then(res => {
		if (res.data.refreshed) {
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({ type: REFRESH_TOKEN, payload: { token: lsdata.token, expires: lsdata.expires } })
		}
		dispatch({ type: EDITPOST, payload: { id: postId, changes: update.update } })
	})
}

export const deletePost = (postId, token, expires, rtoken) => (dispatch) => {
	axios.delete(`/post/${postId}`, { headers: { token, expires, rtoken } }).then(res => {
		if (res.data.refreshed) {
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({ type: REFRESH_TOKEN, payload: { token: lsdata.token, expires: lsdata.expires } })
		}
		dispatch({ type: DELETEPOST, payload: { id: postId } })

	})
}

export const deleteComment = (commentId, token, expires, rtoken) => (dispatch) => {
	axios.delete(`/deleteComment/${commentId}`, { headers: { token, expires, rtoken } }).then(res => {
		if (res.data.refreshed) {
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({ type: REFRESH_TOKEN, payload: { token: lsdata.token, expires: lsdata.expires } })
		}
		dispatch({ type: DELETECOMMENT, payload: { id: commentId } })
	})
}

export const makeComment = (postId, token, expires, rtoken, newComment) => (dispatch) => {

	return axios.post(`/post/${postId}/comment`, newComment, { headers: { token, rtoken, expires } })
		.then(res => {
			if (res.data.refreshed) {
				let lsdata = JSON.parse(localStorage.getItem("data"))
				lsdata.token = res.data.token
				lsdata.expires = res.data.expires
				localStorage.setItem("data", JSON.stringify(lsdata))
				dispatch({ type: REFRESH_TOKEN, payload: { token: lsdata.token, expires: lsdata.expires } })
			}
			dispatch({ type: SETCOMMENTLIST, payload: { newComment: res.data.newComment } })
		})
		.catch(e => {
			console.error(e)
		})

}

export const setCurrentPost = (postId) => (dispatch) => {
	return axios.get(`/post/${postId}`)
		.then(res => {
			const postData = res.data.post
			postData.postId = postId
			dispatch({type: SETCURRENT, payload: [postData]})
		})
	}

export const likePost = (postId, token, expires, rtoken) => (dispatch) => {
	axios.get(`/post/${postId}/like`, {headers: {token, expires, rtoken}}).then(res => {
		console.log(res.data)
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: LIKEPOST, payload: {like: res.data.like, postId}})	
	})
}

export const unlikePost = (postId, token, expires, rtoken) => (dispatch) => {
	axios.get(`/post/${postId}/unlike`, {headers: {token,expires,rtoken}}).then(res => {
		if(res.data.refreshed){
			let lsdata = JSON.parse(localStorage.getItem("data"))
			lsdata.token = res.data.token 
			lsdata.expires = res.data.expires
			localStorage.setItem("data", JSON.stringify(lsdata))
			dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
		}
		dispatch({type: UNLIKEPOST, payload: {postId}})	
	})
}
