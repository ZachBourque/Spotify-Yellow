import queryString from "query-string"
import {Redirect} from "react-router-dom"
import {loadDataIntoState} from "../redux/actions/authActions"
import {loadUser} from "../redux/actions/userActions"
import {connect} from "react-redux"

const Temp = props => {
  const token = queryString.parse(props.location.search)["t"]
  const rtoken = queryString.parse(props.location.search)["rt"]
  const expires = queryString.parse(props.location.search)["ex"]
  const pfp = queryString.parse(props.location.search)["p"]
  const hasAccount = queryString.parse(props.location.search)["a"]
  const id = queryString.parse(props.location.search)["id"]
  if (hasAccount == "true") {
    localStorage.setItem("data", JSON.stringify({token, rtoken, expires}))
    localStorage.setItem("cachepfp", pfp)
    props.loadDataIntoState()
    props.loadUser({token, expires, rtoken})
    return <Redirect to="/" />
  }
  if (!token || !rtoken || !expires) {
    console.error("Uh oh")
    return <Redirect to="/" />
  } else {
    props.history.push({
      pathname: "/signup",
      state: {
        isAuthed: true,
        token,
        rtoken,
        expires,
        id
      }
    })
  }
  return <div></div>
}

const mapStateToProps = state => ({})

const mapActionsToProps = {
  loadUser,
  loadDataIntoState
}

export default connect(mapStateToProps, mapActionsToProps)(Temp)
