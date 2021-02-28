import React from 'react'
import axios from 'axios'
import queryString from 'query-string'


export default class loggedin extends React.Component{

    componentDidMount() {
        const code = queryString.parse(this.props.location.search)['code']
        const state = queryString.parse(this.props.location.search)['state']
        const localState = window.localStorage.getItem('state')
        if(!code || !state || !localState){
            this.props.history.push('/')
            return
        }
        console.log(state, localState)
        if(state === localState){
            axios.get(`http://localhost:5000/spotify-yellow-282e0/us-central1/api/getUserData/${code}`).then(res => {
                window.localStorage.setItem("spotifyData", JSON.stringify(res.data))
                window.localStorage.removeItem("state")
                this.props.history.push('/')
                window.location.reload()
            })
        }
    }

    render(){
        return(
            <div><h1>this is workign</h1></div>
        )
    }
}