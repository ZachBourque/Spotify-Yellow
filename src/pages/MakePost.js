import React, { Component, useState, useEffect } from 'react'
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, makeStyles, Switch } from '@material-ui/core';
import Spotify from 'spotify-web-api-js';
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import DisplayData from '../components/DisplayData'
import $ from 'jquery'


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
}));

const MakePost = ({ userData, token }) => {
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

    const [checked, setChecked] = React.useState(false);
    const s = new Spotify();
    s.setAccessToken(token)


    //functions

    useEffect(() => {
        searchTextChanged($("#searchText").val())
    }, [value])

    useEffect(() => {
        console.log(scene)
    }, [scene])



    const searchTextChanged = (event) => {
        //if the event is empty, dont display anything for search results
        if (event == '' || event?.target?.value == '') { setDataArray(null); setReturnedData(null); return }
        //rather a string or an event is passed in, this just makes temp = the string
        let temp = typeof event == 'string' ? event : event?.target?.value;

        if (value == 'artist') {
            searchArtists(temp);
        } else if (value == 'album') {
            searchAlbums(temp);
        } else if (value == 'song') {
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
                    console.log(data)
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
        console.log(data)
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
                console.log(data)
                if (data) {
                    setReturnedData(data.tracks.items)
                    var tempArray = []
                    for (var i = 0; i < data.tracks.items.length; i++) {
                        var urMom = data.tracks.items[i]
                        tempArray[i] = {
                            type: 'song',
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

    const handleChange = (e) => {
        setChecked(!checked)
    }

    return (
        <div>
            <Paper className={classes.paper}>
                <h3>Make Post</h3>
                {
                    scene == 0 &&
                    (<FormControl component="fieldset">
                        <Grid container wrap="nowrap" spacing={2}>
                            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                                <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                                <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                                <FormControlLabel value="song" control={<Radio />} label="Song" />
                            </RadioGroup>
                            <TextField variant="filled" id="searchText" onChange={searchTextChanged} />
                        </Grid>
                        {dataArray?.map((element, index) => {
                            return <DisplayData element={element} id={index} maxHeight={'200px'} maxWidth={'200px'} onClick={(e) => { setSelectedTopic(dataArray[e.target.id]); setScene(1)}} />
                        })}
                    </FormControl>)
                }
                {
                    scene == 1 && (
                        <div>
                            <DisplayData element={selectedTopic} maxHeight={200} />
                            <form id="contactForm">
                            <TextField
                                    id="postNumber"
                                    label="Number"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="filled"
                                    disabled={checked}
                                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                                />
                                <Switch checked={checked} onChange={handleChange} />
                                <TextField
                                    id="postBody"
                                    label="Post Body"
                                    multiline
                                    rows={6}
                                    variant="outlined"
                                />
                                
                            </form>
                        </div>

                    )

                }
            </Paper>
        </div>
    )
}

export default MakePost
