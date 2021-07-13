import { Button, Grid, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import queryString from "query-string"
import Spotify from 'spotify-web-api-js'
import axios from "axios"
import { refreshToken } from '../redux/actions/authActions'


export const SearchPage = (props) => {

    const [loading, setLoading] = useState(true)
    const [id, setId] = useState(queryString.parse(props.location.search)['id'])
    const [query, setQuery] = useState(queryString.parse(props.location.search)['query'])
    const [result, setResult] = useState(null)
    const s = new Spotify()
    const token = props.auth.token
    s.setAccessToken(token)

    useEffect(() => {
        gettingContent();
    }, [])

    const gettingContent = () => {
        switch (id) {
            case '0':
                break
            case '1':
                searchUsers()
                break
            case '2':
                break
            default:
                break
        }
    }

    const searchUsers = async () => {
        axios.get('/users').then(res => {
            setResult(res.data.users)
            setLoading(false)
            console.log(result)
        })
    }

    return (
        <Grid container justify="center">
            {(!loading && id == 0) && (
                <Grid item md={6} align="center">
                    <button onClick={gettingContent} variant="default">click me 0</button>
                </Grid>
            )} 
            {(!loading && id == 1) && (

                <Grid item md={6} align="center">
                    {result ? result.map((element) => {
                        
                    }) : <></>}
                </Grid>
            )}
            {(!loading && id == 2) && (
                <Grid item md={6} align="center">
                    <button onClick={gettingContent} variant="default">click me 2</button>
                </Grid>
            )}
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

const mapActionsToProps = {
    refreshToken
}

export default connect(mapStateToProps, mapActionsToProps)(SearchPage)
