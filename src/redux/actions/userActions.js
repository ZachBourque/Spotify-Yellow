import {USERLOADING, SETUSERDATA, CLEARERRORS, UPDATEBIO, UPDATEPFP, UPDATEFAVORITES, MARKNOTIFICATIONSREAD, SETSENDMUSICERROR, SETUPDATEPFPERROR, SETUPDATEFAVORITESERROR, SETUPDATEBIOERROR} from "../types"
import axios from "axios"
import {checkForFatalError, handleError, refresh} from "../util"

const getData = (token, expires, rtoken, dispatch) => {
  axios
    .get("/self", {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      if (localStorage.getItem("cachepfp") !== res.data.user.profilepic) {
        localStorage.setItem("cachepfp", res.data.user.profilepic)
      }
      dispatch({type: SETUSERDATA, payload: res.data.user})
    })
    .catch(err => checkForFatalError(err))
}

export const loadUser = (token, expires, rtoken) => dispatch => {
  dispatch({type: USERLOADING})
  getData(token, expires, rtoken, dispatch)
}

export const reloadUserProfile = (token, expires, rtoken) => dispatch => {
  getData(token, expires, rtoken, dispatch)
}

export const editBio = (bio, token, expires, rtoken, history) => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/editBio", {bio}, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEBIO, payload: {bio}})
    })
    .catch(err => handleError(err, SETUPDATEBIOERROR))
}

export const editFavorites = (update, token, expires, rtoken) => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/editFavorites", {update}, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEFAVORITES, payload: update})
    })
    .catch(err => handleError(err, SETUPDATEFAVORITESERROR))
}

export const updateProfilePic = (token, expires, rtoken, formData) => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/uploadPic", formData)
    .then(res => {
      return axios.put("/updatePfp", {url: res.data.url}, {headers: {token, expires, rtoken}})
    })
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEPFP, payload: {pfp: res.data.url}})
    })
    .catch(err => handleError(err, SETUPDATEPFPERROR))
}

export const markNotificationsRead = (notifications, token, expires, rtoken) => dispatch => {
  axios
    .post("/notificationsMarkRead", notifications, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      dispatch({type: MARKNOTIFICATIONSREAD})
    })
    .catch(err => checkForFatalError(err))
}

export const sendMusic = (id, type, recipient, token, expires, rtoken) => dispatch => {
  dispatch({type: CLEARERRORS})
  return axios
    .post("/sendNotification", {id, receiveId: recipient, type}, {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
    })
    .catch(err => handleError(err, SETSENDMUSICERROR))
}
