import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import App from "./App"
import temp from "./components/temp"

const Router = () =>{
    return (
        <BrowserRouter>
        <Route path="/" component={App} exact/>
        <Switch>
        <Route path="/temp" component={temp}/>
        </Switch>
        </BrowserRouter>
    )
}

export default Router