import axios from "axios"
import { SETPROFILEDATA, PROFILELOADING } from "../types"

export const getProfileData = (id) => (dispatch) => {
	console.log("getProfileData")
	dispatch({type: PROFILELOADING})
	axios.get(`/getUser/${id}`).then(res => {
		dispatch({type: SETPROFILEDATA, payload: {...res.data}})
	})
}