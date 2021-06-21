import { USERLOADING, SETUSERDATA, CLEARUSERDATA } from '../types'

const initialState = {
    pfp: null,
    posts: null,
    favAlbums: null,
    favSongs: null,
    favArtists: null,
    bio: null,
    username: null,
    id: null,
    loading: false,
    loaded: false
}

export default function(state = initialState, action){
    switch(action.type){
        case CLEARUSERDATA:
            return initialState
	case USERLOADING:
		return {...initialState, loading: true}
        case SETUSERDATA:
            return {...action.payload, loading: false, loaded: true}
        default:
            return state
    }
}