import { LOGOUT, SETUSERDATA, REFRESH_TOKEN } from '../types'

const initialState = {
    token: null,
    rtoken: null,
    expires: null,
    pfp: null,
    loggedIn: false
}

export default function(state = initialState, action){
    switch(action.type){
        case LOGOUT:
            return initialState
        case SETUSERDATA:
            return {...action.payload, loggedIn: true}
        case REFRESH_TOKEN:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}