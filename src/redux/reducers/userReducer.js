import { USERLOADING, SETUSERDATA, CLEARUSERDATA, UPDATEBIO, UPDATEFAVORITES, UPDATEPFP} from '../types'

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
        case UPDATEFAVORITES:
            return {...state, ...action.payload}
        case UPDATEPFP:
            return {...state, profilepic: action.payload.pfp}
        default:
            return state
    }
}