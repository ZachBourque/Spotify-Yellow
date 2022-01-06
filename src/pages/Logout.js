import {connect} from "react-redux"
import {logout} from "../redux/actions/authActions"
import {Redirect} from "react-router-dom"

function Logout(props) {
  props.logout()
  return <Redirect to="/" />
}

const mapStateToProps = state => ({})

const mapActionsToProps = {
  logout
}

export default connect(mapStateToProps, mapActionsToProps)(Logout)
