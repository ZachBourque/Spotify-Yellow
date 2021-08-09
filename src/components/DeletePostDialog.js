import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText} from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import { deletePost, deleteComment } from '../redux/actions/dataActions'

class DeletePostDialog extends Component {


    state = {
        element: this.props.element,
    }

    componentDidMount() {
        this.setState({deletingFunction: this.props.comment ? this.props.deleteComment : this.props.deletePost})        
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
            <DialogTitle id="alert-dialog-title">Are you sure you want to delete this {this.props.comment ? 'comment' : 'post'}?</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Once this {this.props.comment ? 'comment' : 'post'} is deleted, it cannot be recovered.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {this.state.deletingFunction(this.props.comment ? this.state.element.id : this.state.element.postId , token, expires, rtoken);}}
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
    deletePost,
    deleteComment
}

export default connect(mapStateToProps, mapActionsToProps)(DeletePostDialog)
