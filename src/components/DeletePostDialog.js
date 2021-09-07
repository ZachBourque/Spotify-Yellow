import React, {Component} from "react"
import {connect} from "react-redux"
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Typography} from "@material-ui/core"
import Delete from "@material-ui/icons/Delete"
import {deletePost, deleteComment} from "../redux/actions/dataActions"
import {closeDeleteDialog} from "../redux/actions/UIActions"

class DeletePostDialog extends Component {
  deletingFunction = () => {
    return this.props.element.comment ? this.props.deleteComment : this.props.deletePost
  }

  render() {
    const {token, expires, rtoken} = this.props.auth
    return (
      <Dialog open={this.props.ui.delete.open} onClose={this.props.closeDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Are you sure you want to delete this {this.props.element.comment ? "comment" : "post"}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Once this {this.props.element.comment ? "comment" : "post"} is deleted, it cannot be recovered.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              this.deletingFunction()(this.props.element.comment ? this.props.element.id : this.props.element.postId, token, expires, rtoken)
              this.props.closeDeleteDialog()
            }}
            startIcon={<Delete />}
          >
            Delete
          </Button>
          {this.props.ui.errors.delete && <Typography variant="body1">{this.props.ui.errors.delete}</Typography>}
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
})

const mapActionsToProps = {
  deletePost,
  deleteComment,
  closeDeleteDialog
}

export default connect(mapStateToProps, mapActionsToProps)(DeletePostDialog)
