import { LOGOUT, SETUSERDATA, REFRESH_TOKEN } from '../types'

const initialState = {
    token: null,
    hasAccount: false,
    spotifyData: null,
    firebaseData: null
}

export default function(state = initialState, action){
    switch(action.type){
        case LOGOUT:
            return initialState
        case SETUSERDATA:
            return {...action.payload}
        case REFRESH_TOKEN:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}