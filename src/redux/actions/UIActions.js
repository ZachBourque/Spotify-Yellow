import {TOGGLEMAKEPOSTDIALOG} from "../types"

export const openMakePostDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: true})
}

export const closeMakePostDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: false})
}
