import { LOGOUT, SETUSERDATA } from '../types'

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
        default:
            return state
    }
}