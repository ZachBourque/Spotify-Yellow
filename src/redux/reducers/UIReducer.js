import {SETDIALOGERROR, SETFEEDERROR, CLEARERRORS} from "../types"
const initialState = {
  errors: {
    dialog: null,
    signup: null,
    makePost: null,
    feed: null,
    editPost: null,
    deletePost: null,
    deleteComment: null
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
    default:
      return state
  }
}
