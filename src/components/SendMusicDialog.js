import React, {Component} from "react"
import {connect} from "react-redux"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Card from "@material-ui/core/Card"
import {sendMusic} from "../redux/actions/userActions"
import UserCard from "./UserCard"
import DisplayData from "./DisplayData"
import {closeSendMusicDialog} from "../redux/actions/UIActions"
import Alert from "@material-ui/lab/Alert"
import Grid from "@material-ui/core/Grid"

class SearchUsers extends Component {
  state = {
    searchText: "",
    users: this.props.data.users,
    filteredUsers: [],
    selectedUser: null
  }

  searchTextChanged = e => {
    this.setState({
      searchText: e.target.value,
      filteredUsers: this.state.users.filter(user => {
        return user.username.toLowerCase().includes(e.target.value.toLowerCase())
      })
    })
  }

  handleClick = () => {
    const {id, type} = this.props.ui.sendMusic.element
    this.props.sendMusic(id, type, this.state.selectedUser.id).then(() => {
      this.props.closeSendMusicDialog()
    })
  }

  componentDidUpdate() {
    if (this.props.data.users !== this.state.users) {
      this.setState({users: this.props.data.users})
    }
  }

  setSelectedUser(user) {
    const newSelectedUser = user.id == this.state.selectedUser?.id ? null : user
    this.setState({selectedUser: newSelectedUser})
  }

  render() {
    return (
      <Dialog open={this.props.ui.sendMusic.open} onClose={this.props.closeSendMusicDialog} maxWidth="sm" fullWidth>
        <DialogTitle id="">Send Music:</DialogTitle>
        <DisplayData element={this.props.ui.sendMusic.element} maxWidth="300px" height="300px" />
        <DialogContent>
          {this.props.ui.errors.sendMusic && <Alert severity="error">{this.props.ui.errors.sendMusic}</Alert>}
          <TextField autoFocus id="commentBody" fullWidth variant="outlined" value={this.state.searchText} onChange={this.searchTextChanged} autoComplete="off" />
          {this.state.searchText && (
            <Card>
              <Grid container row>
                {this.state.filteredUsers.map(user => {
                  return (
                    <Grid item xs={12} md={6}>
                      <UserCard user={user} onClick={() => this.setSelectedUser(user)} selected={this.state.selectedUser?.id == user.id} />
                    </Grid>
                  )
                })}
              </Grid>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeSendMusicDialog} color="default">
            Cancel
          </Button>
          <Button onClick={this.handleClick} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  data: state.data,
  ui: state.ui
})

const mapActionsToProps = {
  sendMusic,
  closeSendMusicDialog
}

export default connect(mapStateToProps, mapActionsToProps)(SearchUsers)
