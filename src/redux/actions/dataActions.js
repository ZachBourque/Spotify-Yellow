import {DATALOADING, DELETEPOST, EDITPOST, REFRESH_TOKEN, SETCOMMENTLIST, LIKEPOST, UNLIKEPOST, SETPOSTS, DELETECOMMENT, SETUSERS, SETFEEDERROR, CLEARERRORS} from "../types"
import axios from "axios"
import {refresh, handleError, checkForFatalError} from "../util"

export const getFeedData = () => dispatch => {
  dispatch({type: DATALOADING})
  dispatch({type: CLEARERRORS})
  axios
    .get("/allPosts")
    .then(res => {
      dispatch({type: SETPOSTS, payload: res.data})
    })
    .catch(err => handleError(err, SETFEEDERROR))
}

export const getUsers = () => dispatch => {
  axios
    .get("/users")
    .then(res => {
      dispatch({type: SETUSERS, payload: res.data.users})
    })
    .catch(err => console.error(err)) // change this when you figure out what to do with the users
}

export const setCurrent = arr => dispatch => {
  dispatch({type: SETPOSTS, payload: arr})
}

export const setDataLoading = () => dispatch => {
  dispatch({type: DATALOADING})
}

export const editPost = (postId, update, token, expires, rtoken) => dispatch => {
  axios
    .put(`/editPost/${postId}`, update, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: EDITPOST, payload: {id: postId, changes: update.update}})
    })
    .catch(err => handleError(err))
}

export const deletePost = (postId, token, expires, rtoken) => dispatch => {
  axios.delete(`/post/${postId}`, {headers: {token, expires, rtoken}}).then(res => {
    refresh(res)
    dispatch({type: DELETEPOST, payload: {id: postId}})
  })
}

export const deleteComment = (commentId, token, expires, rtoken) => dispatch => {
  axios
    .delete(`/deleteComment/${commentId}`, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: DELETECOMMENT, payload: {id: commentId}})
    })
    .catch(e => {
      console.log(e)
    })
}

export const makeComment = (postId, token, expires, rtoken, newComment) => dispatch => {
  return axios
    .post(`/post/${postId}/comment`, newComment, {headers: {token, rtoken, expires}})
    .then(res => {
      refresh(res)
      dispatch({type: SETCOMMENTLIST, payload: {newComment: res.data.newComment}})
    })
    .catch(e => {
      console.error(e)
    })
}

export const setCurrentPost = postId => dispatch => {
  return axios.get(`/post/${postId}`).then(res => {
    const postData = res.data.post
    postData.postId = postId
    dispatch({type: SETPOSTS, payload: [postData]})
  })
}

export const likePost = (postId, token, expires, rtoken) => dispatch => {
  axios
    .get(`/post/${postId}/like`, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: LIKEPOST, payload: {like: res.data.like, postId}})
    })
    .catch(err => checkForFatalError(err))
}

export const unlikePost = (postId, token, expires, rtoken) => dispatch => {
  axios
    .get(`/post/${postId}/unlike`, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: UNLIKEPOST, payload: {postId}})
    })
    .catch(err => checkForFatalError(err))
}
