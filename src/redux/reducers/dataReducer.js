import { DATALOADING, SETCURRENT, SETSEARCHDATA, SETFEEDDATA } from '../types'

const initialState = {
	feed: [],
	current: [],
	search: [],
	lastSearch: null,
	loading: false,
	loaded: false
}

export default function(state = initialState, action){
    switch(action.type){
		case DATALOADING:
			return {...state, loading: true, loaded: false}
		case SETSEARCHDATA: 
			return {...state, search: action.payload.posts, current: action.payload.posts, lastSearch: action.payload.search, loading: false, loaded: true}
		case SETFEEDDATA:
			return {...state, feed: action.payload, current: action.payload, loading: false, loaded: true}
		default:
			return state
    }
}