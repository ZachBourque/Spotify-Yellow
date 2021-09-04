import store from "./store"
import {SETDIALOGERROR, REFRESH_TOKEN} from "./types"

export const handleError = (err, type) => {
  if (err?.response?.data?.logout) {
    store.dispatch({type: SETDIALOGERROR, payload: err.response.data.error})
  } else if (err?.response?.data?.error) {
    store.dispatch({type, payload: err?.response?.data?.error})
  } else {
    store.dispatch({type: SETDIALOGERROR, payload: "An unknown error has occured, please try again later."})
  }
}

export const refresh = res => {
  if (res.data.refreshed) {
    let lsdata = JSON.parse(localStorage.getItem("data"))
    lsdata.token = res.data.token
    lsdata.expires = res.data.expires
    localStorage.setItem("data", JSON.stringify(lsdata))
    store.dispatch({type: REFRESH_TOKEN, payload: {token: lsdata.token, expires: lsdata.expires}})
  }
}
