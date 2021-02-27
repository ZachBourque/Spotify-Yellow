import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import App from "./App"
import temp from "./components/temp"
import Profile from "./components/Profile"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { Container, Paper } from '@material-ui/core';
import ButtonAppBar from './components/ButtonAppBar';
import Spotify from 'spotify-web-api-js';

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
        a = JSON.parse(a);
        console.log(a);
        this.setState({
          accessToken: a.token, 
          s: Spotify(), 
          userData: a.data,
          isLoading: false
        })
      }

    theme = createMuiTheme({
        palette: {
          type: "dark",
        },
      });

      render() {
        return (
            <ThemeProvider theme={this.theme}>
            <Paper style={{ height: "100vh" }}>
            <BrowserRouter>
            <Route path="/" >
                <App userData={this.state.isLoading ? '' : this.state.userData} />
            </Route>
            <Switch>
            <Route path="/profile" >
                <Profile
                userData={this.state.userData} />
            </Route>
            </Switch>
            </BrowserRouter>
            </Paper>
          </ThemeProvider>
    
        )
      }

}

export default Router