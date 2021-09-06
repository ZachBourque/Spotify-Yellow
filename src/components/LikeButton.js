import {Fragment, Component} from "react"
import ThumbUp from "@material-ui/icons/ThumbUp"
import ThumbUpOutline from "@material-ui/icons/ThumbUpOutlined"
import {connect} from "react-redux"
import {likePost, unlikePost} from "../redux/actions/dataActions"
import ToolTip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"

class LikeButton extends Component {
  liked = () => {
    return this.props.user.likes && this.props.user.likes.find(like => like?.postId === this.props?.postId)
  }

  likePost = () => {
    if (this.props.auth.loggedIn) {
      this.props.likePost(this.props.postId, this.props.auth.token, this.props.auth.expires, this.props.auth.rtoken)
    } else {
      //idk
    }
  }

  unlikePost = () => {
    if (this.props.auth.loggedIn) {
      this.props.unlikePost(this.props.postId, this.props.auth.token, this.props.auth.expires, this.props.auth.rtoken)
    } else {
      //idk
    }
  }

  render() {
    return (
      <Fragment>
        {this.liked() ? (
          <ToolTip title="Unlike Post" placement="top">
            <IconButton onClick={this.unlikePost}>
              <ThumbUp color="primary" />
            </IconButton>
          </ToolTip>
        ) : (
          <ToolTip title="Like Post" placement="top">
            <IconButton onClick={this.likePost}>
              <ThumbUpOutline />
            </IconButton>
          </ToolTip>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth
})

const mapActionsToProps = {
  likePost,
  unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
