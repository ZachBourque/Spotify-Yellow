import React from "react"
import {Switch, Route, Redirect, BrowserRouter} from "react-router-dom"
import Homepage from "./pages/Homepage"
import ButtonAppBar from "./components/ButtonAppBar"
import Temp from "./pages/temp"
import Profile from "./pages/Profile"
import {ThemeProvider, createMuiTheme} from "@material-ui/core/styles"
import {Container, Paper} from "@material-ui/core"
import SignUp from "./pages/SignUp"
import {connect} from "react-redux"
import {loadDataIntoState} from "./redux/actions/authActions"
import {loadUser} from "./redux/actions/userActions"
import $ from "jquery"
import store from "./redux/store"
import SelfProfile from "./components/SelfProfile"
import BigPost from "./components/BigPost"
import Settings from "./pages/Settings"
import axios from "axios"
import SearchPage from "./pages/SearchPage"
import {getUsers} from "./redux/actions/dataActions"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import {logout} from "./redux/actions/authActions"
import MakePostDialog from "./components/MakePostDialog"
import SendMusicDialog from "./components/SendMusicDialog"
import MakeCommentDialog from "./components/MakeCommentDialog"
import EditPostDialog from "./components/EditPostDialog"
import DeletePostDialog from "./components/DeletePostDialog"
import LoginRNDialog from "./components/LoginRNDialog"
import Logout from "./pages/Logout"

$("body").css("margin", 0)
axios.defaults.baseURL = "https://us-central1-spotify-yellow-282e0.cloudfunctions.net/api"
//axios.defaults.baseURL = "http://localhost:5000/spotify-yellow-282e0/us-central1/api"
if (window.location.href.split("/")[-1] !== "logout") {
  var a = JSON.parse(window.localStorage.getItem("data"))
  if (a) {
    if (a.expires && a.token && a.rtoken && localStorage.getItem("cachepfp")) {
      store.dispatch(loadDataIntoState(a))
      store.dispatch(loadUser(a))
    } else {
      localStorage.removeItem("data")
    }
  }
}
store.dispatch(getUsers())

class Router extends React.Component {
  state = {
    open: false,
    error: null
  }

  handleClose = () => {
    this.setState({open: false})
    window.location.href = "/logout"
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ui.errors.dialog !== this.props.ui.errors.dialog && !this.state.open) {
      if (this.props.ui.errors.dialog) {
        this.setState({open: true, error: this.props.ui.errors.dialog})
      }
    }
  }

  theme = createMuiTheme({
    palette: {
      type: "dark"
    }
  })

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <Paper style={{height: "auto", minHeight: "100vh", overflowX: "hidden", overflowY: "hidden"}}>
          <BrowserRouter>
            <Route path="/" component={ButtonAppBar} />
            <Switch>
              <Route path="/profile=:id" component={Profile} />
              <Route path="/profile" component={SelfProfile} exact />
              <Route path="/" component={Homepage} exact />
              <Route path="/signup" component={SignUp} />
              <Route path="/temp" component={Temp} />
              <Route path="/post/:postID" component={BigPost} />
              <Route path="/settings" component={Settings} />
              <Route path="/search" component={SearchPage} />
              <Route path="/logout" component={Logout} />
            </Switch>
          </BrowserRouter>
          <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Fatal error"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">{this.state.error}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          <MakePostDialog element={JSON.stringify(this.props.ui.makePost.element) === "{}" ? null : this.props.ui.makePost.element} />
          <MakeCommentDialog element={this.props.ui.makeComment.element} />
          <EditPostDialog element={this.props.ui.editPost.element} />
          <DeletePostDialog element={this.props.ui.delete.element} />
          <SendMusicDialog element={this.props.ui.sendMusic.element} />
          <LoginRNDialog />
        </Paper>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapActionsToProps = {
  logout
}

export default connect(mapStateToProps, mapActionsToProps)(Router)
