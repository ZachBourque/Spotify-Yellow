import React, {Component} from "react"
import {connect} from "react-redux"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import DialogContentText from "@material-ui/core/DialogContentText"
import Typography from "@material-ui/core/Typography"
import Dialog from "@material-ui/core/Dialog"
import Delete from "@material-ui/icons/Delete"
import {deletePost, deleteComment} from "../redux/actions/dataActions"
import {closeDeleteDialog} from "../redux/actions/UIActions"
import Alert from "@material-ui/lab/Alert"

class DeletePostDialog extends Component {
  type = this.props.element.comment ? "comment" : "post"

  deletingFunction = () => {
    return this.props.element.comment ? this.props.deleteComment : this.props.deletePost
  }

  render() {
    return (
      <Dialog open={this.props.ui.delete.open} onClose={this.props.closeDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Are you sure you want to delete this {this.type}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Once this {this.type} is deleted, it cannot be recovered.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              this.deletingFunction()(this.props.element.comment ? this.props.element.id : this.props.element.postId)
              this.props.closeDeleteDialog()
            }}
            startIcon={<Delete />}
          >
            Delete
          </Button>
          {this.props.ui.errors.delete && <Alert severity="error">{this.props.ui.errors.delete}</Alert>}
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapActionsToProps = {
  deletePost,
  deleteComment,
  closeDeleteDialog
}

export default connect(mapStateToProps, mapActionsToProps)(DeletePostDialog)
