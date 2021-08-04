import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'

export class DeletePostDialog extends Component {


    state = {
        element: this.props.element,
    }

    render() {
        const { token, expires, rtoken } = this.props.auth;
        return (
            <Dialog
            open={this.props.open}
            onClose={this.props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this post?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Once this post is deleted, it cannot be recovered.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {this.props.deletePost(this.state.element.postId, token, expires, rtoken); this.props.history.push(`/`)}}
                    startIcon={<Delete />}
                >
                    Delete
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

export default connect(mapStateToProps, mapActionsToProps)(DeletePostDialog)
