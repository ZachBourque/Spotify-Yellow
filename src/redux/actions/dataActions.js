import { DATALOADING, SETPOSTDATA, SETFEEDDATA } from '../types'
import axios from "axios"

export const getFeedData = () => (dispatch) => {
	dispatch({type: DATALOADING})
	axios.get('http://localhost:5000/spotify-yellow-282e0/us-central1/api/allPosts').then(res => { 
		dispatch({type: SETFEEDDATA, payload: res.data})
	})
  
}