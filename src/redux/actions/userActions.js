import {USERLOADING, SETUSERDATA, CLEARUSERDATA, LOGOUT, REFRESH_TOKEN, UPDATEBIO, UPDATEPFP, UPDATEFAVORITES, MARKNOTIFICATIONSREAD} from "../types"
import axios from "axios"
import {refresh} from "../util"

const getData = (token, expires, rtoken, dispatch) => {
  console.log("getting data")
  axios
    .get("/self", {headers: {token, expires, rtoken}})
    .then(res => {
      refresh(res)
      if (localStorage.getItem("cachepfp") !== res.data.user.profilepic) {
        localStorage.setItem("cachepfp", res.data.user.profilepic)
      }
      dispatch({type: SETUSERDATA, payload: res.data.user})
    })
    .catch(err => {
      console.log(err?.response?.data?.error)
    })
}

export const loadUser = (token, expires, rtoken) => dispatch => {
  console.log("loadUser")
  dispatch({type: USERLOADING})
  getData(token, expires, rtoken, dispatch)
}

export const reloadUserProfile = (token, expires, rtoken) => dispatch => {
  console.log("reloadUserProfile")
  getData(token, expires, rtoken, dispatch)
}

export const editBio = (bio, token, expires, rtoken, history) => dispatch => {
  axios.post("/editBio", {bio}, {headers: {token, expires, rtoken}}).then(res => {
    refresh(res)
    dispatch({type: UPDATEBIO, payload: {bio}})
  })
}

export const editFavorites = (update, token, expires, rtoken) => dispatch => {
  axios.post("/editFavorites", {update}, {headers: {token, expires, rtoken}}).then(res => {
    refresh(res)
    dispatch({type: UPDATEFAVORITES, payload: update})
  })
}

export const updateProfilePic = (token, expires, rtoken, formData) => dispatch => {
  axios
    .post("/uploadPic", formData)
    .then(res1 => {
      axios
        .put("/updatePfp", {url: res1.data.url}, {headers: {token, expires, rtoken}})
        .then(res => {
          refresh(res)
          dispatch({type: UPDATEPFP, payload: {pfp: res1.data.url}})
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })
}

export const markNotificationsRead = (notifications, token, expires, rtoken) => dispatch => {
  axios.post("/notificationsMarkRead", notifications, {headers: {token, expires, rtoken}}).then(res => {
    refresh(res)
    dispatch({type: MARKNOTIFICATIONSREAD})
  })
}

export const sendMusic = (id, type, recipient, token, expires, rtoken) => dispatch => {
  return axios.post("/sendNotification", {id, receiveId: recipient, type}, {headers: {token, expires, rtoken}}).then(res => {
    refresh(res)
  })
}
