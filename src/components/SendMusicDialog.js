import React, {Component} from "react"
import {connect} from "react-redux"
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Typography, TextField, Card} from "@material-ui/core"
import {makeComment} from "../redux/actions/dataActions"
import {getNewToken} from "../redux/actions/authActions"
import {sendMusic} from "../redux/actions/userActions"
import UserCard from "./UserCard"
import axios from "axios"
import DisplayData from "./DisplayData"

class SearchUsers extends Component {
  state = {
    searchText: "",
    users: this.props.data.users,
    filteredUsers: [],
    topic: {},
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
    const {id, type} = this.state.topic
    const {token, expires, rtoken} = this.props.auth
    this.props.sendMusic(id, type, this.state.selectedUser.id, token, expires, rtoken).then(res => {
      console.log("SUCCESS")
      this.props.onClose()
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
      <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth="sm" fullWidth>
        <DialogTitle id="">Send Music:</DialogTitle>
        <DisplayData element={this.state.topic} maxHeight="200px" />
        <DialogContent>
          <TextField autoFocus id="commentBody" fullWidth variant="outlined" value={this.state.searchText} onChange={this.searchTextChanged} autoComplete="off" />
          {this.state.searchText && (
            <Card>
              {this.state.filteredUsers.map(user => {
                return <UserCard user={user} onClick={() => this.setSelectedUser(user)} selected={this.state.selectedUser?.id == user.id} />
              })}
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="default">
            Cancel
          </Button>
          <Button onClick={this.handleClick} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
        <DialogContent></DialogContent>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  data: state.data
})

const mapActionsToProps = {
  sendMusic
}

export default connect(mapStateToProps, mapActionsToProps)(SearchUsers)
