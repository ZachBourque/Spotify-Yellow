import { SETPROFILEDATA, CLEARPROFILEDATA } from '../types'

const initialState = {
    pfp: null,
    posts: null,
    favAlbums: null,
    favSongs: null,
    favArtists: null,
    bio: null,
    username: null,
    id: null,
    self: false,
    loading: true
}

export default function(state = initialState, action){
    switch(action.type){
        case CLEARPROFILEDATA:
            return initialState
        case SETPROFILEDATA:
            return {...action.payload}
        default:
            return state
    }
}