import {Fragment, Component} from "react"
import ThumbUp from "@material-ui/icons/ThumbUp"
import ThumbUpOutline from "@material-ui/icons/ThumbUpOutlined"
import {connect} from "react-redux"
import {likePost, unlikePost} from "../redux/actions/dataActions"
import {openLoginDialog} from "../redux/actions/UIActions"
import ToolTip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"

class LikeButton extends Component {
  liked = () => {
    return this.props.user.likes && this.props.user.likes.find(like => like?.postId === this.props?.postId)
  }

  likePost = () => {
    if (this.props.auth.loggedIn) {
      this.props.likePost(this.props.postId)
    } else {
      this.props.openLoginDialog()
    }
  }

  unlikePost = () => {
    this.props.unlikePost(this.props.postId)
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
  auth: state.auth,
  user: state.user
})

const mapActionsToProps = {
  likePost,
  unlikePost,
  openLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)
