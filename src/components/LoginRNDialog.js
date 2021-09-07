import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

export class LoginRNDialog extends Component {
    render() {

        return (
            <Dialog onClose={this.props.onClose} aria-labelledby="customized-dialog-title" open={this.props.open} maxWidth="sm" fullWidth>
                <DialogContent>

            

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.props.onClose} color="default">
                        Login
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

export default connect(mapStateToProps, mapActionsToProps)(LoginRNDialog)
