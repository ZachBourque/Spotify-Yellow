import {Dialog, DialogActions, DialogContent, Grid, Button} from "@material-ui/core"
import React, {Component} from "react"
import {connect} from "react-redux"
import MakePost from "./MakePost"
import {closeMakePostDialog} from "../redux/actions/UIActions"

class PostOnTopicDialog extends Component {
  render() {
    let {element} = this.props
    return (
      <Dialog onClose={this.props.closeMakePostDialog} aria-labelledby="customized-dialog-title" open={this.props.ui.makePost.open} maxWidth="sm" fullWidth>
        <DialogContent>
          <MakePost selectedTopic={element} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeMakePostDialog} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapActionsToProps = {
  closeMakePostDialog
}

export default connect(mapStateToProps, mapActionsToProps)(PostOnTopicDialog)
