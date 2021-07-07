import { SETPROFILEDATA, CLEARPROFILEDATA, PROFILELOADING } from '../types'

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
        case CLEARPROFILEDATA:
            return initialState
        case PROFILELOADING:
            return {...state, loading: true, loaded: false}
        case SETPROFILEDATA:
            return {...action.payload, loading: false, loaded: true}
        default:
            return state
    }
}