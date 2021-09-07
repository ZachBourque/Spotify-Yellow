import {TOGGLEMAKEPOSTDIALOG, TOGGLEMAKECOMMENTDIALOG, TOGGLEEDITPOSTDIALOG, TOGGLEDELETEDIALOG, TOGGLESENDMUSICDIALOG, TOGGLELOGINDIALOG} from "../types"

export const openMakePostDialog = element => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: element})
}

export const closeMakePostDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: false})
}

export const openMakeCommentDialog = element => dispatch => {
  dispatch({type: TOGGLEMAKECOMMENTDIALOG, payload: {element}})
}

export const closeMakeCommentDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKECOMMENTDIALOG, payload: false})
}

export const openEditPostDialog = element => dispatch => {
  dispatch({type: TOGGLEEDITPOSTDIALOG, payload: {element}})
}

export const closeEditPostDialog = () => dispatch => {
  dispatch({type: TOGGLEEDITPOSTDIALOG, payload: false})
}

export const openDeleteDialog = element => dispatch => {
  dispatch({type: TOGGLEDELETEDIALOG, payload: element})
}

export const closeDeleteDialog = () => dispatch => {
  dispatch({type: TOGGLEDELETEDIALOG, payload: false})
}

export const openSendMusicDialog = element => dispatch => {
  dispatch({type: TOGGLESENDMUSICDIALOG, payload: element})
}

export const closeSendMusicDialog = () => dispatch => {
  dispatch({type: TOGGLESENDMUSICDIALOG, payload: false})
}

export const openLoginDialog = () => dispatch => {
  dispatch({type: TOGGLELOGINDIALOG, payload: true})
}

export const closeLoginDialog = () => dispatch => {
  dispatch({type: TOGGLELOGINDIALOG, payload: false})
}
