import { USERLOADING, SETUSERDATA, CLEARUSERDATA, UPDATEBIO } from '../types'

const initialState = {
    profilepic: null,
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
        case UPDATEBIO: 
            return {...state, bio: action.payload.bio}
        default:
            return state
    }
}