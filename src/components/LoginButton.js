import React, { Component } from 'react'
import {Button} from '@material-ui/core'
import axios from 'axios'

export default class LoginButton extends Component {


    click = () => {
        if(!this.props.loggedIn){
            axios.get('http://localhost:5000/spotify-yellow-282e0/us-central1/api/login').then(res => {
                window.localStorage.setItem("state",res.data.state)
                window.location.href = res.data.url
            })
        }else{
            window.localStorage.removeItem("spotifyData")
            window.location.reload()
        }
    }

    render() {
        return (
            <Button variant="contained" onClick={this.click} color="">
                {this.props.loggedIn ? "Logout" : "Login"}
            </Button>
        )
    }
}
