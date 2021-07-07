import { DATALOADING, SETPOSTDATA, SETFEEDDATA } from '../types'
import axios from "axios"

export const getFeedData = () => (dispatch) => {
	dispatch({type: DATALOADING})
	axios.get('/allPosts').then(res => { 
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
  
}

export const getPostsBySpotifyid = () => (dispatch) => {
	dispatch({type: DATALOADING})
	axios.get('/allPosts').then(res => { 
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
  
}