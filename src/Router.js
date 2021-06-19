import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import Home from './pages/Home' 
import Temp from "./pages/temp"
import Profile from "./pages/Profile"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { Container, Paper } from '@material-ui/core';
import SignUp from './pages/SignUp'
import { connect } from "react-redux"
import { loadDataIntoState } from './redux/actions/userActions'

class Router extends React.Component {

      componentDidMount() {
        var a = JSON.parse(window.localStorage.getItem("data"));
        if (!a) {
          return
        }
        if(a.pfp && a.expires && a.token && a.rtoken ){
          console.log("loading")
          this.props.loadDataIntoState()
        } else {
          localStorage.removeItem("data")
        }
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
            <Route path="/" component={Home}/>
            <Switch>
            <Route path="/profile" component={Profile}/>
            <Route path="/signup" component={SignUp}/>
            <Route path='/temp' component={Temp}/>
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