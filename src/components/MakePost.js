import React, {Component, useState, useEffect} from "react"
import {TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, makeStyles, Switch, TextareaAutosize} from "@material-ui/core"
import Spotify from "spotify-web-api-js"
import {Container, Avatar, Grid, Paper, Typography, Card, CardHeader, CardContent, Button, Divider} from "@material-ui/core"
import DisplayData from "./DisplayData"
import $ from "jquery"
import {connect} from "react-redux"
import Zero from "../assets/0.png"
import One from "../assets/1.png"
import Two from "../assets/2.png"
import Three from "../assets/3.png"
import Four from "../assets/4.png"
import Five from "../assets/5.png"
import Six from "../assets/6.png"
import Seven from "../assets/7.png"
import Eight from "../assets/8.png"
import Nine from "../assets/9.png"
import Ten from "../assets/10.png"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import IconButton from "@material-ui/core/IconButton"
import {refreshToken} from "../redux/actions/authActions"
import axios from "axios"
import {makePost} from "../redux/actions/dataActions"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 1000,
    textAlign: "center"
  },
  image: {
    width: 128,
    height: 128
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  rating: {
    margin: "auto",
    display: "block",
    maxWidth: "100px",
    maxHeight: "100px"
  }
}))

const MakePost = props => {
  const classes = useStyles()
  //Scene 0:
  //Radio Button Value
  const [value, setValue] = useState("artist")
  //Data returned from the Spotify API
  const [returnedData, setReturnedData] = useState(null)
  //Parsed data that is displayed to the user
  const [dataArray, setDataArray] = useState(null)
  //Scene for the post making process
  console.log("hi", props.selectedTopic)
  const [scene, setScene] = useState(props.selectedTopic ? 1 : 0)
  const [searchError, setSearchError] = useState(null)
  //Scene 1:
  //An object from the dataArray that is the topic of the post
  const [selectedTopic, setSelectedTopic] = useState(props.selectedTopic)
  //The user input for the post
  const [postRating, setRating] = useState(5)
  const [postTitle, setTitle] = useState("")
  const [postBody, setBody] = useState("")
  //Toggles using the number rating
  const [switchState, setSwitchState] = useState(true)

  //Images array for the rating numbers
  const [imagesArray, setImagesArray] = useState([Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten])

  const s = new Spotify()
  const token = props.auth.token
  s.setAccessToken(token)

  useEffect(() => {
    searchTextChanged($("#searchText").val())
  }, [value])
  const searchTextChanged = event => {
    //if the event is empty, dont display anything for search results
    if (event == "" || event?.target?.value == "") {
      setDataArray(null)
      setReturnedData(null)
      return
    }
    //rather a string or an event is passed in, this just makes temp = the string
    let temp = typeof event == "string" ? event : event?.target?.value

    if (value == "artist") {
      searchArtists(temp)
    } else if (value == "album") {
      searchAlbums(temp)
    } else if (value == "track") {
      searchSongs(temp)
    }
  }

  const radioChanged = event => {
    setValue(event.target.value)
  }

  const incrementScene = () => {
    setScene(scene + 1)
  }

  //Searches Spotify API for Artist
  const searchArtists = query => {
    setSearchError(null)
    s.searchArtists(query, {limit: 5})
      .then(data => {
        if (data) {
          setReturnedData(data.artists.items)
          var tempArray = []
          for (var i = 0; i < data.artists.items.length; i++) {
            var urMom = data.artists.items[i]
            tempArray[i] = {
              type: "artist",
              id: urMom.id,
              artistName: [urMom.name],
              albumName: null,
              songName: null,
              image: urMom.images[0]?.url
            }
          }
          setDataArray(tempArray)
        } else {
          setSearchError("Error getting data")
        }
      })
      .catch(err => {
        console.error(err)
        setSearchError("Error getting data")
      })
  }

  //Searches Spotify API for album
  const searchAlbums = query => {
    setSearchError(null)
    const limit = 5
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${limit}`, {
      method: "GET",
      headers: {Authorization: "Bearer " + token}
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if (data.albums) {
          setReturnedData(data.albums.items)
          var tempArray = []
          for (var i = 0; i < data.albums.items.length; i++) {
            var urMom = data.albums.items[i]
            tempArray[i] = {
              type: "album",
              id: urMom.id,
              artistName: urMom.artists.map(e => e.name),
              albumName: urMom.name,
              songName: null,
              image: urMom.images[0]?.url
            }
          }
          setDataArray(tempArray)
        } else {
          setSearchError("Error getting data")
        }
      })
      .catch(err => {
        console.error(err)
        setSearchError("Error getting data")
      })
  }

  //Searches Spotify API for song
  const searchSongs = query => {
    setSearchError(null)
    s.searchTracks(query, {limit: 5})
      .then(data => {
        if (data) {
          setReturnedData(data.tracks.items)
          var tempArray = []
          for (var i = 0; i < data.tracks.items.length; i++) {
            var urMom = data.tracks.items[i]
            tempArray[i] = {
              type: "track",
              id: urMom.id,
              artistName: urMom.artists.map(e => e.name),
              albumName: urMom.album.name,
              songName: urMom.name,
              image: urMom.album.images[0]?.url
            }
          }
          setDataArray(tempArray)
        }
      })
      .catch(err => {
        console.error(err)
        setSearchError("Error getting data")
      })
  }

  const sendPost = () => {
    let newPost = {
      album: selectedTopic.albumName ? selectedTopic.albumName : null,
      artist: selectedTopic.artistName ? selectedTopic.artistName : null,
      body: postBody,
      pic: selectedTopic.image,
      rating: switchState ? postRating : null,
      track: selectedTopic.songName ? selectedTopic.songName : null,
      title: postTitle,
      topic: selectedTopic.songName || selectedTopic.albumName || selectedTopic.artistName[0],
      type: value,
      spotifyid: selectedTopic.id
    }
    props.makePost(newPost, props.auth.token, props.auth.expires, props.auth.rtoken)
  }

  const handleSwitchChange = event => {
    setSwitchState(!switchState)
  }

  return (
    <Card style={{backgroundColor: "#4d4d4d"}} align="center">
      <CardHeader title={<Typography variant="h4">Make Post</Typography>} style={{backgroundColor: "#D99E2A"}} />
      <CardContent>
        {scene == 0 && (
          <FormControl component="fieldset">
            <Grid container justify="center" alignItems="center">
              <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                <FormControlLabel value="track" control={<Radio />} label="Track" />
              </RadioGroup>
              <TextField variant="filled" id="searchText" onChange={searchTextChanged} />
            </Grid>
            <Divider style={{margin: "10px"}} />
            <Grid container justify="center">
              {searchError ? (
                <Typography variant="body1">{searchError}</Typography>
              ) : (
                dataArray?.map((element, index) => {
                  return (
                    <Grid item>
                      <DisplayData
                        element={element}
                        id={index}
                        maxWidth={225}
                        onClick={() => {
                          setSelectedTopic(dataArray[index])
                          setScene(1)
                        }}
                      />
                    </Grid>
                  )
                })
              )}
            </Grid>
          </FormControl>
        )}
        {scene == 1 && (
          <div>
            <DisplayData element={selectedTopic} maxHeight={200} />
            <form id="contactForm">
              <div>
                <Switch checked={switchState} onChange={handleSwitchChange} name="useNumber" inputProps={{"aria-label": "secondary checkbox"}} />
                {!switchState ? (
                  ""
                ) : (
                  <div>
                    <img className={classes.rating} src={imagesArray[postRating]} />
                    <IconButton aria-label="minus" onClick={() => setRating(!(postRating == 0) ? postRating - 1 : postRating)}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton aria-label="plus" onClick={() => setRating(!(postRating == 10) ? postRating + 1 : postRating)}>
                      <AddIcon />
                    </IconButton>
                  </div>
                )}
              </div>
              <TextField id="postTitle" label="Post Title" rows={1} fullWidth variant="outlined" value={postTitle} onChange={e => setTitle(e.target.value)} />
              <br />
              <TextField id="postBody" label="Post Body" multiline rows={6} fullWidth variant="outlined" value={postBody} margin="dense" onChange={e => setBody(e.target.value)} />
            </form>
            <Button color="primary" variant="contained" onClick={() => sendPost()}>
              Make Post
            </Button>
            {props.ui.errors.makePost && <Typography variant="body1">{props.ui.errors.makePost}</Typography>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
})

const mapActionsToProps = {
  makePost
}

export default connect(mapStateToProps, mapActionsToProps)(MakePost)
