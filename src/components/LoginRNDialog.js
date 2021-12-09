import {connect} from "react-redux"
import queryString from "querystring"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import Button from "@material-ui/core/Button"
import {closeLoginDialog} from "../redux/actions/UIActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"

const LoginRNDialog = props => {
  const url =
    "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: "e5f1276d07b74135956c8b3130f79f3f",
      scope: "user-read-private user-read-email user-read-playback-state",
      redirect_uri: "https://us-central1-spotify-yellow-282e0.cloudfunctions.net/api/callback"
    })
  return (
    <Dialog onClose={props.closeLoginDialog} aria-labelledby="customized-dialog-title" open={props.ui.login.open} maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">Log in</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">You must be logged in to do that.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeLoginDialog} color="default">
          Cancel
        </Button>
        <Button color="default" href={url}>
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapActionsToProps = {
  closeLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(LoginRNDialog)
