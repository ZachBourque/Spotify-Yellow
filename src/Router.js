import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import App from "./App"

const Router = () =>{
    return (
        <BrowserRouter>
        <Route path="/" component={App}/>
        <Switch>
        </Switch>
        </BrowserRouter>
    )
}

export default Router