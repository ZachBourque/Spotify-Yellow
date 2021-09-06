import {TOGGLEMAKEPOSTDIALOG, TOGGLEMAKECOMMENTDIALOG, TOGGLEEDITPOSTDIALOG, TOGGLEDELETEDIALOG, TOGGLESENDMUSICDIALOG} from "../types"

export const openMakePostDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: true})
}

export const closeMakePostDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKEPOSTDIALOG, payload: false})
}

export const openMakeCommentDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKECOMMENTDIALOG, payload: true})
}

export const closeMakeCommentDialog = () => dispatch => {
  dispatch({type: TOGGLEMAKECOMMENTDIALOG, payload: false})
}

export const openEditPostDialog = () => dispatch => {
  dispatch({type: TOGGLEEDITPOSTDIALOG, payload: true})
}

export const closeEditPostDialog = () => dispatch => {
  dispatch({type: TOGGLEEDITPOSTDIALOG, payload: false})
}

export const openDeleteDialog = () => dispatch => {
  dispatch({type: TOGGLEDELETEDIALOG, payload: true})
}

export const closeDeleteDialog = () => dispatch => {
  dispatch({type: TOGGLEDELETEDIALOG, payload: false})
}

export const openSendMusicDialog = () => dispatch => {
  dispatch({type: TOGGLESENDMUSICDIALOG, payload: true})
}

export const closeSendMusicDialog = () => dispatch => {
  dispatch({type: TOGGLESENDMUSICDIALOG, payload: false})
}
