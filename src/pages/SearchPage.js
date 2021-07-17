<<<<<<< HEAD
import { Button, Grid, Typography } from '@material-ui/core'
import UserCard from '../components/UserCard'
import React, { Component } from 'react'
=======
import { Button, Grid, Typography, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText, FormLabel } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
>>>>>>> 141ccad... Comments working!
import { connect } from 'react-redux'
import queryString from "query-string"
import Spotify from 'spotify-web-api-js'
import axios from "axios"
import { getNewToken } from '../redux/actions/authActions'
import AppBar from "@material-ui/core/AppBar"
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { PersonOutlineSharp } from '@material-ui/icons'
import DisplayData from '../components/DisplayData'
import SmallPost from '../components/SmallPost'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from "@material-ui/core/Radio"

class SearchPage extends Component {

    state = {
        loading: true,
        query: queryString.parse(this.props.location.search)['query'],
        id: parseInt(queryString.parse(this.props.location.search)['id']),
        filter: 0,
        radioState: 0,
        users: null,
        posts: null,
        items: null,
        s: new Spotify().setAccessToken(this.props.auth.token)
    }

    handleRadioChange = (event) => {
        this.props.history.push(`/search?query=${this.state.query}&id=${this.state.id}&filter=${event.target.value}`)
    }

    search = async (query, id, filter) => {
        console.log(query)
        query = query.toLowerCase()
        this.setState({loading: true})
        let display = []
        switch(id){
            case 1:
                let {expires, rtoken} = this.props.auth
                let now = new Date().getTime()
                if(now > expires){
                    console.log("running")
                    this.props.getNewToken(rtoken, this.search)
                    this.props.auth.expires = 10000000000000000000000000000000000000
                    return
                }
                let s = new Spotify()
                s.setAccessToken(this.props.auth.token)
                console.log(s)
                switch(filter){
                    case 0: 
                        let artists = await s.searchArtists(query, {limit: 10})
                        artists.artists.items.forEach(artist => {
                            display.push({type: "artist", id: artist.id, artistName: [artist.name], albumName: null, songName: null, image: artist.images[0]?.url})
                        })

                        break
                    case 1: 
                        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${10}`, {
                            method: 'GET',
                            headers: { 'Authorization': 'Bearer ' + this.props.auth.token }
                        });
                        const data = await result.json();
                        if(data.albums){
                            data.albums.items.forEach(album => {
                                display.push({type: "album", id: album.id, artistName: album.artists.map(e => e.name), albumName: album.name, songName: null, image: album.images[0]?.url})
                            })
                        }
                        break
                    case 2:
                        s.searchTracks(query, {limit: 10}).then(data => {
                            data.tracks.items.forEach(song => {
                                display.push({type: "track", id: song.id, artistName: song.artists.map(e => e.name), albumName: song.album.name, songName: song.name, image: song.images[0]?.url})
                            })
                        })
                        break
                    }
                break
            case 2:
                let users = this.state.users
                switch(filter){
                    case 0:
                        display = [...users.filter(a => a.username.toLowerCase().includes(query))]
                        break
                    case 1:
                        display = [...users.filter(a => a.bio.toLowerCase().includes(query))]
                        break
                }
                break
            case 0:
                let posts = this.state.posts
                switch(filter){
                    case 0: 
                        display = [...posts.filter(a => a.title.toLowerCase().includes(query))]
                        break
                    case 1:
                        display = [...posts.filter(a => a.body.toLowerCase().includes(query))]
                        break
                    case 2: 
                        display = [...posts.filter(a => a.topic.toLowerCase().includes(query))]
                        break
                    case 3:
                        display = [...posts.filter(a => a.type.toLowerCase().includes(query))]
                        break
                }
                break
        }
        console.log("done")
        console.log(display)
        this.setState({items: display, loading: false})
    }

    componentDidUpdate() {
        if(!this.state.users || !this.state.posts){
            return
        }
        console.log("update")
        let query = queryString.parse(this.props.location.search)['query']
        let id = parseInt(queryString.parse(this.props.location.search)['id'])
        let filter = parseInt(queryString.parse(this.props.location.search)['filter']) 
        if(query !== this.state.query || id !== this.state.id || filter !== this.state.filter){
            console.log("searching")
            this.setState({query, id, filter, loading: true})
            this.props.history.push(`/search?query=${query}&id=${id}&filter=${filter}`)
            this.search(query, id, filter)
        }
    }

    componentDidMount = async () => {
        let query = queryString.parse(this.props.location.search)['query']
        let id = parseInt(queryString.parse(this.props.location.search)['id'])
        let filter = parseInt(queryString.parse(this.props.location.search)['filter']) 
        axios.get('/users').then(res => {
            this.setState({users: res.data.users})
            if(this.state.posts){
                this.search(query, id, filter)
            }
        })
        axios.get('/allPosts').then(res => {
            this.setState({posts: res.data})
            if(this.state.users){
                this.search(query, id, filter)
            }
        })
    }

<<<<<<< HEAD

    tabChange = (event, newValue) => {
        this.props.history.push(`/search?query=${this.state.query}&id=${newValue}&filter=${0}`)

    }

    render() {
        let radioArr = [
            (
                <>
                <FormControlLabel value={0} control={<Radio />} label="Title" />
                <FormControlLabel value={1} control={<Radio />} label="Body" />
                <FormControlLabel value={2} control={<Radio />} label="Topic" />
                <FormControlLabel value={3} control={<Radio />} label="Type" />
                </>
            ), (
                <>
                <FormControlLabel value={0} control={<Radio />} label="Artist" />
                <FormControlLabel value={1} control={<Radio />} label="Album/EP" />
                <FormControlLabel value={2} control={<Radio />} label="Track" />
                </>
            ),(
                <>
                <FormControlLabel value={0} control={<Radio />} label="Username" />
                <FormControlLabel value={1} control={<Radio />} label="Bio" />
                </>
            )
        ]
        return (
            <Grid container>
               <Grid item sm/>
               <Grid item md={6}>
                <AppBar position="static" color="default">
                    <Tabs 
                    value={this.state.id}
                    onChange={this.tabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    >
                        <Tab label="Posts"/>
                        <Tab label="Spotify"/>
                        <Tab label="Users"/>
                    </Tabs>
                </AppBar>
                {!this.state.loading && this.state.items.length > 0 && (
                    <>
                    {this.state.id === 0 && this.state.items.map((item, idx) => {
                        return <SmallPost element={item} history={this.props.history} key={idx} postId={item.postId}/>
                    })}
                    {this.state.id === 1 && this.state.items.map((item, idx) => {
                        return <DisplayData element={item} id={idx} maxHeight={'200px'} maxWidth={'200px'} key={idx} onClick={() => {}}/>
                    })}
                    {this.state.id === 2 && this.state.items.map((item, idx) => {
                        return <UserCard user={item} key={idx} history={this.props.history}/>
                    })}
                    </>
                )}
                </Grid> 
                <Grid item sm>
                    <RadioGroup aria-label="gender" name="gender1" value={this.filter} onChange={this.handleRadioChange}>
                            {radioArr[this.state.id ? this.state.id : 0]}
                        </RadioGroup>
=======
    return (
        <Grid container justify="center">
            {(id == 0) && (
                <>
                    <Grid item md></Grid>
                    <Grid item md={5} align="center">
                        <button onClick={gettingContent} variant="default">click me 0</button>
                    </Grid>
                    <Grid item md>
                        <RadioGroup aria-label="gender" name="gender1" value={radioState} onChange={handleRadioChange}>
                            <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                            <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                            <FormControlLabel value="track" control={<Radio />} label="Track" />
                        </RadioGroup>
                    </Grid>
                </>
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
>>>>>>> 141ccad... Comments working!
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    data: state.data
})

const mapActionsToProps = {
    getNewToken
}

export default connect(mapStateToProps, mapActionsToProps)(SearchPage)
