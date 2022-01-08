import axios from "axios"
import {LOGOUT, SETAUTHDATA, REFRESH_TOKEN, LOADTOKEN, SETSIGNUPERROR, CLEARERRORS, SETDIALOGERROR} from "../types"
import {handleError} from "../util"

export const loadDataIntoState = a => dispatch => {
  dispatch({type: SETAUTHDATA, payload: a})
}

export const signUpUser = (data, history) => dispatch => {
  dispatch({type: CLEARERRORS})
  let now = new Date().getTime()
  if (now > data.expires) {
    history.push("/")
  }
  if (data.pfp) {
    axios
      .post("/createUser", {id: data.id, username: data.username, profilepic: "default", token: data.token})
      .then(res => {
        window.localStorage.setItem("data", JSON.stringify({token: data.token, expires: data.expires, rtoken: data.rtoken}))
        window.localStorage.setItem("cachepfp", data.pfp)
        dispatch({type: SETAUTHDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
        window.location.href = `/profile=${data.id}`
      })
      .catch(err => handleError(err, SETSIGNUPERROR))
  } else {
    axios
      .post("/uploadpic", data.formData)
      .then(res => {
        return axios.post("/createUser", {id: data.id, username: data.username, profilepic: res.data.url, token: data.token})
      })
      .then(res => {
        window.localStorage.setItem("data", JSON.stringify({token: data.token, expires: data.expires, rtoken: data.rtoken}))
        window.localStorage.setItem("cachepfp", res.data.profilepic)
        dispatch({type: SETAUTHDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
        window.location.href = `/profile=${data.id}`
      })
      .catch(err => handleError(err, SETSIGNUPERROR))
  }
}

export const logout = () => dispatch => {
  dispatch({type: LOGOUT})
  localStorage.removeItem("data")
  localStorage.removeItem("cachepfp")
}

export const refreshToken = (token, expires) => dispatch => {
  dispatch({type: REFRESH_TOKEN, payload: {token, expires}})
}

export const getNewToken = rtoken => dispatch => {
  dispatch({type: LOADTOKEN})
  axios
    .get("/token", {headers: {rtoken}})
    .then(res => {
      let lsdata = JSON.parse(localStorage.getItem("data"))
      lsdata.token = res.data.token
      lsdata.expires = res.data.expires
      localStorage.setItem("data", JSON.stringify(lsdata))
      dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
    })
    .catch(err => handleError(err, SETDIALOGERROR))
}
