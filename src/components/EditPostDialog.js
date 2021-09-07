import React, {Component} from "react"
import Typography from "@material-ui/core/Typography"
import {connect} from "react-redux"
import {Dialog, DialogTitle, DialogContent, TextField, Grid, Switch, IconButton, DialogActions, Button} from "@material-ui/core"
import Add from "@material-ui/icons/Add"
import Remove from "@material-ui/icons/Remove"
import Send from "@material-ui/icons/Send"
import Zero from "../assets/0.png"
import One from "../assets/1.png"
import Two from "../assets/2.png"
import Three from "../assets/3.png"
import Four from "../assets/4.png"
import Five from "../assets/5.png"
import Six from "../assets/6.png"
import Seven from "../assets/7.png"
import Eight from "../assets/8.png"
import Nine from "../assets/9.png"
import Ten from "../assets/10.png"
import {deletePost, editPost} from "../redux/actions/dataActions"
import {reloadUserProfile} from "../redux/actions/userActions"
import {closeEditPostDialog} from "../redux/actions/UIActions"

class EditPostDialog extends Component {
  imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten]

  state = {
    newRating: this.props.element.rating,
    newTitle: this.props.element.title,
    newBody: this.props.element.body,
    switchState: this.props.element.rating ? true : false
  }

  componentDidMount() {}

  handleSwitchChange = event => {
    this.setState({switchState: !this.state.switchState})
  }

  handleTitleChange = e => {
    this.setState({newTitle: e.target.value})
  }

  handleBodyChange = e => {
    this.setState({newBody: e.target.value})
  }

  editPost(postId, newTitle, newBody, newRating) {
    const {title, body, rating} = this.props.ui.editPost.element
    const {token, expires, rtoken} = this.props.auth
    let changes = {}
    if (title != newTitle) {
      changes.title = newTitle
    }
    if (body != newBody) {
      changes.body = newBody
    }
    if (rating != newRating) {
      changes.rating = newRating
    }
    if (JSON.stringify(changes) === "{}") {
      return
    }

    this.props.editPost(postId, {update: changes}, token, expires, rtoken)
  }

  render() {
    const {element} = this.props.ui.editPost
    return (
      <Dialog open={this.props.ui.editPost.open} onClose={this.props.closeEditPostDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
        <DialogTitle id="alert-dialog-title">Edit Post:</DialogTitle>
        <DialogContent>
          <TextField id="newTitle" label="Post Title" rows={1} fullWidth variant="outlined" defaultValue={element.title} onChange={this.handleTitleChange} />

          <TextField id="newBody" label="Post Body" multiline rows={6} fullWidth variant="outlined" defaultValue={element.body} onChange={this.handleBodyChange} margin="dense" />
          <Grid container direction="row" justify="center">
            <Grid item>
              <Switch checked={this.state.switchState} onChange={this.handleSwitchChange} name="useNumber" inputProps={{"aria-label": "secondary checkbox"}} />
            </Grid>
          </Grid>
          {!this.state.switchState ? (
            ""
          ) : (
            <>
              <Grid container direction="row" justify="center">
                <Grid item>
                  <img src={this.imagesArray[this.state.newRating]} style={{width: "200px", height: "200px"}} />
                </Grid>
              </Grid>
              <Grid container direction="row" justify="center">
                <Grid item>
                  <IconButton aria-label="minus" onClick={() => this.setState({newRating: this.state.newRating !== 0 ? this.state.newRating - 1 : this.state.newRating})}>
                    <Remove />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton aria-label="plus" onClick={() => this.setState({newRating: this.state.newRating !== 10 ? this.state.newRating + 1 : this.state.newRating})}>
                    <Add />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeEditPostDialog} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" color="primary" endIcon={<Send />} onClick={() => this.editPost(element.postId, this.state.newTitle, this.state.newBody, this.state.newRating > -1 && this.state.switchState ? this.state.newRating : null)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  data: state.data,
  auth: state.auth
})

const mapActionsToProps = {
  reloadUserProfile,
  deletePost,
  editPost,
  closeEditPostDialog
}

export default connect(mapStateToProps, mapActionsToProps)(EditPostDialog)
