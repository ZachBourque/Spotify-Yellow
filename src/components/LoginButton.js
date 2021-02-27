import React, { Component } from 'react'
import {Button} from '@material-ui/core'
import axios from 'axios'

export default class LoginButton extends Component {

    state = {
        buttonText: ''
    }



    click() {
    axios.get('http://localhost:5000/spotify-yellow-282e0/us-central1/api/login').then(res => {
        console.log(window)
      window.localStorage.setItem("state",res.data.state)
      window.location.href = res.data.url
    })
    }

    render() {
        return (
            <Button variant="contained" onClick={this.click} color="">
                {this.props.loggedIn ? "Logout" : "Login"}
            </Button>
        )
    }
}
