import React from "react"
import {connect} from "react-redux"
import {reloadUserProfile, loadUser} from "../redux/actions/userActions"
import {useEffect} from "react"
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"

function SelfProfile(props) {
  let {auth, user, history} = props
  useEffect(() => {
    if (!auth.loggedIn) {
      history.push("/")
    } else if (user.loaded) {
      props.reloadUserProfile(auth.token, auth.expires, auth.rtoken)
      history.replace({
        pathname: `/profile=${user.id}`,
        state: {setData: true, user}
      })
    } else if (!user.loading) {
      props.loadUser(auth.token, auth.expires, auth.rtoken)
    }
  })
  return <ProfileSkeleton />
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
})

const mapActionsToProps = {
  reloadUserProfile,
  loadUser
}

export default connect(mapStateToProps, mapActionsToProps)(SelfProfile)
