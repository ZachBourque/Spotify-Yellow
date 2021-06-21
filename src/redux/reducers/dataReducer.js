import { DATALOADING, SETPOSTDATA, SETFEEDDATA } from '../types'

const initialState = {
	posts: [],
	post: null,
	loading: false,
	loaded: false
}

export default function(state = initialState, action){
    switch(action.type){
	case DATALOADING:
		return {...state, loading: true, loaded: false}
	case SETPOSTDATA: 
		return {...state, post: action.payload, loading: false, loaded: true}
	case SETFEEDDATA:
		return {...state, posts: action.payload, loading: false, loaded: true}
		default:
            return state
    }
}