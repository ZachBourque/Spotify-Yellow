import {DATALOADING, DELETEPOST, EDITPOST, REFRESH_TOKEN, SETCOMMENTLIST, LIKEPOST, UNLIKEPOST, SETPOSTS, DELETECOMMENT, SETUSERS, SETFEEDERROR, CLEARERRORS, SETEDITPOSTERROR, SETDELETEERROR, SETMAKECOMMENTERROR, SETMAKEPOSTERROR} from "../types"
import axios from "axios"
import {refresh, handleError, checkForFatalError, getAuth} from "../util"

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

export const makePost = newPost => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/createPost", newPost, {headers: getAuth()})
    .then(res => {
      refresh(res)

      window.location.reload()
    })
    .catch(err => {
      console.error(err)
      handleError(err, SETMAKEPOSTERROR)
    })
}

export const editPost = (postId, update) => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .put(`/editPost/${postId}`, update, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: EDITPOST, payload: {id: postId, changes: update.update}})
    })
    .catch(err => handleError(err, SETEDITPOSTERROR))
}

export const deletePost = postId => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .delete(`/post/${postId}`, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: DELETEPOST, payload: {id: postId}})
    })
    .catch(err => handleError(err, SETDELETEERROR))
}

export const deleteComment = commentId => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .delete(`/deleteComment/${commentId}`, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: DELETECOMMENT, payload: {id: commentId}})
    })
    .catch(err => handleError(err, SETDELETEERROR))
}

export const makeComment = (postId, newComment) => dispatch => {
  dispatch({type: CLEARERRORS})
  return new Promise(async (resolve, reject) => {
    try {
      let res = axios.post(`/post/${postId}/comment`, newComment, {headers: getAuth()})
      refresh(res)
      dispatch({type: SETCOMMENTLIST, payload: {newComment: res.data.newComment}})
      resolve()
    } catch (err) {
      handleError(err, SETMAKECOMMENTERROR)
      reject(err)
    }
  })
}

export const setCurrentPost = postId => dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios.get(`/post/${postId}`)
      const postData = res.data.post
      postData.postId = postId
      dispatch({type: SETPOSTS, payload: [postData]})
      resolve()
    } catch (err) {
      console.error(err)
      reject()
    }
  })
}

export const likePost = postId => dispatch => {
  axios
    .get(`/post/${postId}/like`, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: LIKEPOST, payload: {like: res.data.like, postId}})
    })
    .catch(err => checkForFatalError(err))
}

export const unlikePost = postId => dispatch => {
  axios
    .get(`/post/${postId}/unlike`, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: UNLIKEPOST, payload: {postId}})
    })
    .catch(err => checkForFatalError(err))
}
