import { LOGOUT, SETAUTHDATA, REFRESH_TOKEN, LOADTOKEN } from '../types'

const initialState = {
    token: null,
    rtoken: null,
    expires: null,
    loggedIn: false,
    tokenLoading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case LOGOUT:
            return initialState
        case SETAUTHDATA:
            return {...action.payload, loggedIn: true, tokenLoading: false}
        case REFRESH_TOKEN:
            return {
                ...state, 
                ...action.payload,
                tokenLoading: false
            }
        case LOADTOKEN:
            return {
                ...state,
                tokenLoading: true
            }
        default:
            return state
    }
}