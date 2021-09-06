import { Dialog, DialogActions, DialogContent, Grid, Button } from '@material-ui/core'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import MakePost from './MakePost'


export class PostOnTopicDialog extends Component {
  render() {
    let { element } = this.props;
    return (

      <Dialog onClose={this.props.onClose} aria-labelledby="customized-dialog-title" open={this.props.open} maxWidth="sm" fullWidth>
        <DialogContent>
          
              <MakePost
                selectedTopic={element}
              />

        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(PostOnTopicDialog)
