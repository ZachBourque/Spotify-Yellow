import React from 'react'
import axios from 'axios'
import queryString from 'query-string'




export default class loggedin extends React.Component{

    state = {
        error: null
    }

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

                if(res.data.hasAccount){
                    this.props.history.push(`/profile/${res.data.firebaseID}`)
                    window.location.reload()
                } else {
                    this.props.history.push('/sign-up')
                    window.location.reload()
                }
            })
        } else {
            this.setState({
                error: true
            })
            this.props.history.push('/temp')
        }
    }

    render(){
        return(
            <div>
                {this.state.error ? <h1>State doesn't match I give up.</h1> : <h1>Logging you in.</h1>}
            </div>
        )
    }
}