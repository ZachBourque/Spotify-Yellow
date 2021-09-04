import {SETDIALOGERROR, SETFEEDERROR, CLEARERRORS, SETDELETEERROR, SETSIGNUPERROR, SETEDITPOSTERROR, SETMAKEPOSTERROR, SETUPDATEBIOERROR, SETUPDATEPFPERROR, SETSENDMUSICERROR, SETUPDATEFAVORITESERROR} from "../types"
const initialState = {
  errors: {
    dialog: null,
    signup: null,
    makePost: null,
    feed: null,
    editPost: null,
    delete: null,
    makeComment: null,
    bio: null,
    pfp: null,
    favorites: null,
    sendMusic: null
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SETDIALOGERROR:
      return {...state, errors: {...state.errors, dialog: action.payload}}
    case SETFEEDERROR:
      return {...state, errors: {...state.errors, feed: action.payload}}
    case CLEARERRORS:
      return {...state, errors: {...initialState.errors}}
    case SETDELETEERROR:
      return {...state, errors: {...state.errors, delete: action.payload}}
    case SETSIGNUPERROR:
      return {...state, errors: {...state.errors, signup: action.payload}}
    case SETEDITPOSTERROR:
      return {...state, errors: {...state.errors, editPost: action.payload}}
    case SETMAKEPOSTERROR:
      return {...state, errors: {...state.errors, makePost: action.payload}}
    case SETUPDATEBIOERROR:
      return {...state, errors: {...state.errors, bio: action.payload}}
    case SETUPDATEPFPERROR:
      return {...state, errors: {...state.errors, pfp: action.payload}}
    case SETSENDMUSICERROR:
      return {...state, errors: {...state.errors, sendMusic: action.payload}}
    case SETUPDATEFAVORITESERROR:
      return {...state, errors: {...state.errors, favorites: action.payload}}
    default:
      return state
  }
}
