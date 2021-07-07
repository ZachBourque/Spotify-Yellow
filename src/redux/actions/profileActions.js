import axios from "axios"
import { SETPROFILEDATA, PROFILELOADING } from "../types"

export const getProfileData = (id) => (dispatch) => {
	console.log("getProfileData")
	dispatch({type: PROFILELOADING})
	axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/getUser/${id}`).then(res => {
		dispatch({type: SETPROFILEDATA, payload: {...res.data}})
	})
}