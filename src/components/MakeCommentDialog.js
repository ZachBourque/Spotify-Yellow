import React, {Component} from "react"
import {connect} from "react-redux"
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Typography, TextField} from "@material-ui/core"
import {makeComment} from "../redux/actions/dataActions"
import {getNewToken} from "../redux/actions/authActions"
import Delete from "@material-ui/icons/Delete"
import axios from "axios"
import {closeMakeCommentDialog} from "../redux/actions/UIActions"

class MakeCommentDialog extends Component {
  state = {
    emptyBodyBoolean: false,
    commentBody: ""
  }

  commentTextChanged = e => {
    this.setState({commentBody: e.target.value})
  }

  sendComment = () => {
    if (!this.state.commentBody) {
      this.setState({emptyBodyBoolean: true})
      return
    }

    if (this.props.auth.tokenLoading) {
      return
    }
    let now = new Date().getTime()
    if (now > this.props.auth.expires) {
      this.props.getNewToken(this.props.auth.rtoken, this.sendComment)
      this.props.auth.expires = 1000000000000000000000000000000000
      return
    }

    const newComment = {
      body: this.state.commentBody,
      postId: this.props.element.postId,
      authorid: this.props.user.id,
      username: this.props.user.username,
      pfp: this.props.user.profilepic
    }

    this.props.makeComment(this.props.element.postId, newComment).then(res => {
      this.props.closeMakeCommentDialog()
      this.setState({commentBody: "", emptyBodyBoolean: false})
    })
  }

  render() {
    return (
      <Dialog open={this.props.ui.makeComment.open} onClose={this.props.closeMakeCommentDialog} maxWidth="xs" fullWidth>
        <DialogTitle id="" style={{backgroundColor: "#A88F5D"}}>
          Make Comment:
        </DialogTitle>
        {this.state.emptyBodyBoolean && (
          <Typography color="error" variant="body1" align="center">
            Comment must not be empty
          </Typography>
        )}
        <DialogContent>
          <TextField autoFocus id="commentBody" type="email" multiline rows={6} fullWidth variant="outlined" value={this.state.commentBody} onChange={this.commentTextChanged} />
          {this.props.ui.errors.makeComment && <Typography variant="body1">{this.props.ui.errors.makeComment}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeMakeCommentDialog} color="default">
            Cancel
          </Button>
          <Button onClick={this.sendComment} color="primary" variant="contained">
            Comment
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  ui: state.ui
})

const mapActionsToProps = {
  makeComment,
  getNewToken,
  closeMakeCommentDialog
}

export default connect(mapStateToProps, mapActionsToProps)(MakeCommentDialog)
