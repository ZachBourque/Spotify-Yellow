import axios from 'axios'
import { LOGOUT, SETUSERDATA, REFRESH_TOKEN } from '../types'

export const loadDataIntoState = () => (dispatch) => {
    console.log()
    dispatch({type: SETUSERDATA, payload: JSON.parse(window.localStorage.getItem("spotifyData"))})
}

export const signUpUser = (data, history) => (dispatch) => {
    
    axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/uploadpic", data.formData).then(res => {
        axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createUser", {id: data.id, username: data.username, profilepic: res.data.url}).then(res => {
            let sd = JSON.parse(window.localStorage.getItem("spotifyData"));
            sd.id = res.data.firebaseID
            sd.pfp = res.data.profilepic
            sd.hasAccount = true
            console.log(res.data)
            window.localStorage.setItem("spotifyData", JSON.stringify(sd))
            history.push("/profile");
            })
        })
}