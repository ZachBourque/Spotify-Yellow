import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, Grid } from '@material-ui/core';
import DisplayData from './DisplayData'
import Spotify from 'spotify-web-api-js'
import $ from 'jquery'
import { refreshToken } from '../redux/actions/authActions'

const SpotifySearch = (props) => {

    const [value, setValue] = useState('artist');
    //Data returned from the Spotify API
    const [returnedData, setReturnedData] = useState(null);
    //Parsed data that is displayed to the user
    const [dataArray, setDataArray] = useState(null);
    //Scene for the post making process
    const [selectedTopic, setSelectedTopic] = useState(null);
    const s = new Spotify();
    const token = props.auth.token;
    s.setAccessToken(token);


    //functions

    useEffect(() => {
        searchTextChanged($("#searchText").val())
    }, [value])




    const searchTextChanged = (event) => {
        let now = new Date().getTime()
        if (now < props.auth.expires) {

        }
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

    return (
        <FormControl component="fieldset">
            <Grid container wrap="nowrap" spacing={2}>
                <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                    <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                    <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                    <FormControlLabel value="track" control={<Radio />} label="Track" />
                </RadioGroup>
                <TextField variant="filled" id="searchText" onChange={searchTextChanged} />
            </Grid>
            {dataArray?.map((element, index) => {
                return <DisplayData element={element} id={index} maxHeight={'200px'} maxWidth={'200px'} onClick={(e) => { setSelectedTopic(dataArray[e.target.id]); }} />
            })}
        </FormControl>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

const mapDispatchToProps = {
    refreshToken
}

export default connect(mapStateToProps, mapDispatchToProps)(SpotifySearch)