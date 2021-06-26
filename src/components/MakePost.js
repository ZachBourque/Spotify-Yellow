import React, { Component, useState, useEffect } from 'react'
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, makeStyles, Switch, TextareaAutosize } from '@material-ui/core';
import Spotify from 'spotify-web-api-js';
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import DisplayData from './DisplayData'
import $ from 'jquery'
import { connect } from 'react-redux'
import Zero from '../assets/0.png'
import One from '../assets/1.png'
import Two from '../assets/2.png'
import Three from '../assets/3.png'
import Four from '../assets/4.png'
import Five from '../assets/5.png'
import Six from '../assets/6.png'
import Seven from '../assets/7.png'
import Eight from '../assets/8.png'
import Nine from '../assets/9.png'
import Ten from '../assets/10.png'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import { refreshToken } from '../redux/actions/authActions'
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 1000,
        textAlign: 'center',
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    rating: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100px',
        maxHeight: '100px',
    }
}));

const MakePost = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState('artist');
    //Data returned from the Spotify API
    const [returnedData, setReturnedData] = useState(null);
    //Parsed data that is displayed to the user
    const [dataArray, setDataArray] = useState(null);
    //Scene for the post making process
    const [scene, setScene] = useState(0);
    //An object from the dataArray that is the topic of the post
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [postRating, setRating] = useState(5);
    const [postTitle, setTitle] = useState('');
    const [postBody, setBody] = useState('');

    const [imagesArray, setImagesArray] = useState([Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten]);
    const [switchState, setSwitchState] = useState(true);

    const s = new Spotify();
    const token = props.auth.token;
    s.setAccessToken(token);


    //functions

    useEffect(() => {
        searchTextChanged($("#searchText").val())
    }, [value])




    const searchTextChanged = (event) => {
        //if the event is empty, dont display anything for search results
        if (event == '' || event?.target?.value == '') { setDataArray(null); setReturnedData(null); return }
        //rather a string or an event is passed in, this just makes temp = the string
        let temp = typeof event == 'string' ? event : event?.target?.value;

        if (value == 'artist') {
            searchArtists(temp);
        } else if (value == 'album') {
            searchAlbums(temp);
        } else if (value == 'track') {
            searchSongs(temp);
        }

    }

    const radioChanged = (event) => {
        setValue(event.target.value);
    };

    const incrementScene = () => {
        setScene(scene + 1);
    }

    //Searches Spotify API for Artist
    const searchArtists = (query) => {
        let prev = s.searchArtists(query, { limit: 5 });
        prev.then(
            function (data) {
                prev = null;
                if (data) {
                    setReturnedData(data.artists.items)
                    var tempArray = []
                    for (var i = 0; i < data.artists.items.length; i++) {
                        var urMom = data.artists.items[i]
                        tempArray[i] = {
                            type: 'artist',
                            id: urMom.id,
                            artistName: urMom.name,
                            albumName: null,
                            songName: null,
                            image: urMom.images[0]?.url,
                        }
                    }
                    setDataArray(tempArray)
                }
            },
            function (err) {
                console.error(err);
            }
        );
    }

    //Searches Spotify API for album
    const searchAlbums = async (query) => {
        const limit = 5;
        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await result.json();
        if (data.albums) {
            setReturnedData(data.albums.items)
            var tempArray = []
            for (var i = 0; i < data.albums.items.length; i++) {
                var urMom = data.albums.items[i]
                tempArray[i] = {
                    type: 'album',
                    id: urMom.id,
                    artistName: urMom.artists[0].name,
                    albumName: urMom.name,
                    songName: null,
                    image: urMom.images[0]?.url,
                }
            }
            setDataArray(tempArray)
        }
    }

    //Searches Spotify API for song 
    const searchSongs = (query) => {
        let prev = s.searchTracks(query, { limit: 5 });
        prev.then(
            function (data) {
                // clean the promise so it doesn't call abort
                prev = null;
                if (data) {
                    setReturnedData(data.tracks.items)
                    var tempArray = []
                    for (var i = 0; i < data.tracks.items.length; i++) {
                        var urMom = data.tracks.items[i]
                        tempArray[i] = {
                            type: 'track',
                            id: urMom.id,
                            artistName: urMom.artists[0].name,
                            albumName: urMom.album.name,
                            songName: urMom.name,
                            image: urMom.album.images[0]?.url,
                        }
                    }
                    setDataArray(tempArray)
                }
            },
            function (err) {
                console.error(err);
            }
        );
    }

    const sendPost = () => {
        let newPost = {
            token: props.auth.token,
            rtoken: props.auth.rtoken,
            expires: props.auth.expires,
            album: selectedTopic.albumName ? selectedTopic.albumName : null,
            artist: selectedTopic.artistName ? selectedTopic.artistName : null,
            body: postBody,
            pic: selectedTopic.image,
            rating: switchState ? postRating : null,
            track: selectedTopic.songName ? selectedTopic.songName : null,
            title: postTitle,
            topic: selectedTopic.type,
            type: value,
            spotifyid: selectedTopic.id
        }
        axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createPost", newPost)
            .then(res => {
                console.log(res.data)
                if(res.data.refreshed){
                    let data = JSON.parse(localStorage.getItem("data"))
                    data.token = res.data.token 
                    data.expires = res.data.expires
                    localStorage.setItem("data", JSON.stringify(data))
                    props.refreshToken(res.data.token, res.data.expires)
                }
                window.location.reload()
            })
            .catch (err => console.error(err))

    }

    const handleSwitchChange = (event) => {
        setSwitchState(!switchState);
    }

    return (
        <div>
            <Paper className={classes.paper}>
                <Typography variant="h3">Make Post</Typography>
                {
                    scene == 0 &&
                    (<FormControl component="fieldset">
                        <Grid container wrap="nowrap" spacing={2}>
                            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                                <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                                <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                                <FormControlLabel value="track" control={<Radio />} label="Track" />
                            </RadioGroup>
                            <TextField variant="filled" id="searchText" onChange={searchTextChanged} />
                        </Grid>
                        {dataArray?.map((element, index) => {
                            return <DisplayData element={element} id={index} maxHeight={'200px'} maxWidth={'200px'} onClick={(e) => { setSelectedTopic(dataArray[e.target.id]); setScene(1);}} />
                        })}
                    </FormControl>)
                }
                {
                    scene == 1 && (
                        <div>
                            <DisplayData element={selectedTopic} maxHeight={200} />
                            <form id="contactForm">
                                <div>
                                    <Switch
                                        checked={switchState}
                                        onChange={handleSwitchChange}
                                        name="useNumber"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    {!switchState ? '' : (<div>
                                        <img className={classes.rating} src={imagesArray[postRating]} />
                                        <IconButton aria-label="minus" onClick={() => setRating(!(postRating == 0) ? postRating - 1 : postRating)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <IconButton aria-label="plus" onClick={() => setRating(!(postRating == 10) ? postRating + 1 : postRating)}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>)}
                                </div>
                                <TextField
                                    id="postTitle"
                                    label="Post Title"
                                    rows={1}
                                    variant="outlined"
                                    value={postTitle}
                                    onChange={(e) => setTitle(e.target.value)}
                                /><br />
                                <TextField
                                    id="postBody"
                                    label="Post Body"
                                    multiline
                                    rows={6}
                                    variant="outlined"
                                    value={postBody}
                                    onChange={(e) => setBody(e.target.value)}
                                />

                            </form>
                            <button type="button" onClick={() => sendPost()} >Make Post</button>
                        </div>
                    )
                }
            </Paper>
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

const mapActionsToProps = {
    refreshToken
}

export default connect(mapStateToProps, mapActionsToProps)(MakePost)
