import { DATALOADING, SETFEEDDATA } from '../types'
import axios from "axios"

export const getFeedData = () => (dispatch) => {
	dispatch({type: DATALOADING})
	axios.get('/allPosts').then(res => { 
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
  
}

export const reloadFeedData = () => (dispatch) => {
	axios.get('/allPosts').then(res => {
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
}


