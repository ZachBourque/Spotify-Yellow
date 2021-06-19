import axios from 'axios'
import { LOGOUT, SETUSERDATA, REFRESH_TOKEN } from '../types'

export const loadDataIntoState = () => (dispatch) => {
    dispatch({type: SETUSERDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
}

export const signUpUser = (data, history, window ) => (dispatch) => {
    console.log(data)
    if(data.pfp){
        axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createUser", {id: data.id, username: data.username, profilepic: data.pfp}).then(res => {
            window.localStorage.setItem("data", JSON.stringify(data))
            dispatch({type: SETUSERDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
            history.push(`/profile=${data.id}`)
        })
    } else {
        axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/uploadpic", data.formData).then(res => {
            axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createUser", {id: data.id, username: data.username, profilepic: res.data.url}).then(res2 => {
                window.localStorage.setItem("data", JSON.stringify({id: data.id, token: data.token, expires: data.expires, rtoken: data.rtoken, pfp: res.data.url, username: data.username}))
                dispatch({type: SETUSERDATA, payload: JSON.parse(window.localStorage.getItem("data"))})
                history.push(`/profile=${data.id}`);
                })
            })
    }
}

export const refreshToken = (data) => (dispatch) => {
    dispatch({type: SETUSERDATA, payload: data})
}