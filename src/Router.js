import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import App from "./App"
import temp from "./pages/temp"
import Profile from "./pages/Profile"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { Container, Paper } from '@material-ui/core';
import ButtonAppBar from './components/ButtonAppBar';
import Spotify from 'spotify-web-api-js';
import SignUp from './pages/SignUp'
import { connect } from "react-redux"
import { loadDataIntoState } from './redux/actions/userActions'

class Router extends React.Component {
    state = {
        accessToken: null,
        s: null,
        redirect: null,
        userData: null,
        isLoading: true,
      }
    
      componentDidMount() {
        var a = window.localStorage.getItem("spotifyData");
        if (!a) {
          return
        }
        console.log("this")
        this.props.loadDataIntoState()
      }

    theme = createMuiTheme({
        palette: {
          type: "dark",
        },
      });

      render() {
        return (
            <ThemeProvider theme={this.theme}>
            <Paper style={{ height: "auto", minHeight: '100vh'}}>
            <BrowserRouter>
            <Route path="/" >
                <App token={this.state.isLoading ? null : this.state.accessToken} userData={this.state.isLoading ? null : this.state.userData} />
            </Route>
            <Switch>
            <Route path="/profile" >
                <Profile
                token={this.state.isLoading ? 'aaa' : this.state.accessToken} userData={this.state.isLoading ? null : this.state.userData}/>
            </Route>
            <Route path="/sign-up" >
                {this.state.userData ? <SignUp userData={this.state.userData} /> : ''}
            </Route>
            <Route path='/temp' component={temp}/>
            </Switch>
            </BrowserRouter>
            </Paper>
          </ThemeProvider>
    
        )
      }

}

const mapStateToProps = (state) => {

}

const mapActionsToProps = {
  loadDataIntoState
}

export default connect(mapStateToProps, mapActionsToProps)(Router)