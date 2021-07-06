import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import Homepage from './pages/Homepage'
import Home from './pages/Home' 
import Temp from "./pages/temp"
import Profile from "./pages/Profile"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { Container, Paper } from '@material-ui/core';
import SignUp from './pages/SignUp'
import { connect } from "react-redux"
import { loadDataIntoState } from './redux/actions/authActions'
import { loadUser } from "./redux/actions/userActions"
import $ from "jquery"
import { Provider } from 'react-redux'
import store from './redux/store'
import SelfProfile from "./components/SelfProfile"
import SmallPost from "./components/SmallPost"
import BigPost from "./components/BigPost"

$("body").css("margin", 0)
$("body").css("overflow-x", "hidden")
var a = JSON.parse(window.localStorage.getItem("data"));
if (a) {
  if(a.expires && a.token && a.rtoken && localStorage.getItem("cachepfp") ){
    console.log("loading")
    store.dispatch(loadDataIntoState())
  } else {
    localStorage.removeItem("data")
  }
}

class Router extends React.Component {

    theme = createMuiTheme({
        palette: {
          type: "dark",
        },
      });

      render() {
        return (
            <Provider store={store}>
            <ThemeProvider theme={this.theme}>
            <Paper style={{ height: "auto", minHeight: '100vh'}}>
            <BrowserRouter>
            <Route path="/" component={Home} />
            <Switch>
            <Route path="/profile=:id" component={Profile}/>
            <Route path="/profile" component={SelfProfile} exact/>
            <Route path="/" component={Homepage} exact/>
            <Route path="/signup" component={SignUp}/>
            <Route path='/temp' component={Temp}/>
            <Route path='/post/:postID' component={BigPost} />
            </Switch>
            </BrowserRouter>
            </Paper>
          </ThemeProvider>
          </Provider>
        )
      }

}

export default Router