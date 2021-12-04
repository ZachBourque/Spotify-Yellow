import {USERLOADING, SETUSERDATA, CLEARERRORS, UPDATEBIO, UPDATEPFP, UPDATEFAVORITES, MARKNOTIFICATIONSREAD, SETSENDMUSICERROR, SETUPDATEPFPERROR, SETUPDATEFAVORITESERROR, SETUPDATEBIOERROR} from "../types"
import axios from "axios"
import {checkForFatalError, handleError, refresh, getAuth} from "../util"

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

export const loadUser = a => dispatch => {
  let {token, expires, rtoken} = a
  dispatch({type: USERLOADING})
  getData(token, expires, rtoken, dispatch)
}

export const reloadUserProfile = () => dispatch => {
  let {token, expires, rtoken} = getAuth()
  getData(token, expires, rtoken, dispatch)
}

export const editBio = bio => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/editBio", {bio}, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEBIO, payload: {bio}})
    })
    .catch(err => handleError(err, SETUPDATEBIOERROR))
}

export const editFavorites = update => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/editFavorites", {update}, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEFAVORITES, payload: update})
    })
    .catch(err => handleError(err, SETUPDATEFAVORITESERROR))
}

export const updateProfilePic = formData => dispatch => {
  dispatch({type: CLEARERRORS})
  axios
    .post("/uploadPic", formData)
    .then(res => {
      return axios.put("/updatePfp", {url: res.data.url}, {headers: getAuth()})
    })
    .then(res => {
      refresh(res)
      dispatch({type: UPDATEPFP, payload: {pfp: res.data.url}})
    })
    .catch(err => handleError(err, SETUPDATEPFPERROR))
}

export const markNotificationsRead = notifications => dispatch => {
  axios
    .post("/notificationsMarkRead", notifications, {headers: getAuth()})
    .then(res => {
      refresh(res)
      dispatch({type: MARKNOTIFICATIONSREAD})
    })
    .catch(err => checkForFatalError(err))
}

export const sendMusic = (id, type, recipient) => dispatch => {
  dispatch({type: CLEARERRORS})
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios.post("/sendNotification", {id, receiveId: recipient, type}, {headers: getAuth()})
      refresh(res)
      resolve()
    } catch (err) {
      handleError(err, SETSENDMUSICERROR)
      reject()
    }
  })
}
