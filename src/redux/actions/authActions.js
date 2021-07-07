import axios from 'axios'
import { LOGOUT, SETAUTHDATA, REFRESH_TOKEN, CLEARUSERDATA } from '../types'

export const loadDataIntoState = () => (dispatch) => {
    dispatch({type: SETAUTHDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
}

export const signUpUser = (data, history) => (dispatch) => {
    let now = new Date().getTime()
    if(now > data.expires){
        history.push("/")
    }
    if(data.pfp){
        axios.post("/createUser", {id: data.id, username: data.username, profilepic: data.pfp}).then(res => {
            window.localStorage.setItem("data", JSON.stringify({token: data.token, expires: data.expires, rtoken: data.rtoken}))
            window.localStorage.setItem("cachepfp", data.pfp)
            dispatch({type: SETAUTHDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
            history.push(`/profile=${data.id}`)
        })
    } else {
        axios.post("/uploadpic", data.formData).then(res => {
            axios.post("/createUser", {id: data.id, username: data.username, profilepic: res.data.url}).then(res2 => {
                window.localStorage.setItem("data", JSON.stringify({token: data.token, expires: data.expires, rtoken: data.rtoken}))
                window.localStorage.setItem("cachepfp", res.data.url)
                dispatch({type: SETAUTHDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
                history.push(`/profile=${data.id}`);
                })
            })
    }
}

export const logout = (history) => (dispatch) => {
    localStorage.removeItem("data")
    dispatch({type: LOGOUT})
    dispatch({type: CLEARUSERDATA})
    history.push("/")
}

export const refreshToken = (token, expires) => (dispatch) => {
    dispatch({type: REFRESH_TOKEN, payload: {token, expires}})
}