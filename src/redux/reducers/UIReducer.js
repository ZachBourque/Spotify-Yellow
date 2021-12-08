import {SETUSERNAMEERROR, SETDIALOGERROR, SETFEEDERROR, CLEARERRORS, SETDELETEERROR, SETSIGNUPERROR, SETEDITPOSTERROR, SETMAKEPOSTERROR, SETUPDATEBIOERROR, SETUPDATEPFPERROR, SETSENDMUSICERROR, SETUPDATEFAVORITESERROR, TOGGLEMAKEPOSTDIALOG, TOGGLEMAKECOMMENTDIALOG, TOGGLEEDITPOSTDIALOG, TOGGLEDELETEDIALOG, TOGGLESENDMUSICDIALOG, TOGGLELOGINDIALOG} from "../types"
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
    sendMusic: null,
    username: null
  },
  sendMusic: {
    open: false,
    element: {
      type: null,
      id: null,
      artistName: null,
      albumName: null,
      songName: null,
      image: null,
      url: null
    }
  },
  makePost: {
    open: false,
    element: {
      type: null,
      id: null,
      artistName: null,
      albumName: null,
      songName: null,
      image: null
    }
  },
  editPost: {
    open: false,
    element: {
      rating: null,
      title: null,
      body: null
    }
  },
  delete: {
    open: false,
    element: {
      comment: null
    }
  },
  makeComment: {
    open: false,
    element: null
  },
  login: {
    open: false
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SETDIALOGERROR:
      return {...state, errors: {...state.errors, dialog: action.payload}}
    case SETUSERNAMEERROR:
      return {...state, errors: {...state.errors, username: action.payload}}
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
    case TOGGLEMAKEPOSTDIALOG:
      return action.payload === false ? {...state, makePost: {...initialState.makePost}} : {...state, makePost: {open: true, element: {...action.payload}}}
    case TOGGLEMAKECOMMENTDIALOG:
      return action.payload === false ? {...state, makeComment: {...initialState.makeComment}} : {...state, makeComment: {open: true, ...action.payload}}
    case TOGGLEEDITPOSTDIALOG:
      return action.payload === false ? {...state, editPost: {...initialState.editPost}} : {...state, editPost: {open: true, ...action.payload}}
    case TOGGLEDELETEDIALOG:
      return action.payload === false ? {...state, delete: {...initialState.delete}} : {...state, delete: {open: true, element: {...action.payload}}}
    case TOGGLESENDMUSICDIALOG:
      return action.payload === false ? {...state, sendMusic: {...initialState.sendMusic}} : {...state, sendMusic: {open: true, element: {...action.payload}}}
    case TOGGLELOGINDIALOG:
      return {...state, login: {open: action.payload}}
    default:
      return state
  }
}
