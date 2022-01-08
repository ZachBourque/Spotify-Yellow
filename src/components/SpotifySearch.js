import React, {useState, useEffect} from "react"
import {connect} from "react-redux"
import {TextField, Radio, RadioGroup, FormControlLabel, FormControl, Grid, Dialog, DialogContent, Typography, CardHeader, Card, DialogActions, Button, Divider} from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import Grid from "@material-ui/core/Grid"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import Typography from "@material-ui/core/Typography"
import CardHeader from "@material-ui/core/CardHeader"
import Card from "@material-ui/core/Card"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import DisplayData from "./DisplayData"
import Spotify from "spotify-web-api-js"
import $ from "jquery"
import {getNewToken} from "../redux/actions/authActions"

const SpotifySearch = props => {
  const [value, setValue] = useState(props.type ? props.type : "artist")
  const [error, setError] = useState(null)
  const [radioDisabledStatus, setRadioDisabledStatus] = useState([false, false, false])
  const [gettingToken, setGettingToken] = useState(false)
  const [callback, setCallback] = useState([])
  useEffect(() => {
    setGettingToken(false)
    if (callback[0] && callback[1]) {
      callback[0](...callback[1])
      setCallback([])
    }
  }, [props.auth.token])
  //Data returned from the Spotify API
  const [returnedData, setReturnedData] = useState(null)
  //Parsed data that is displayed to the user
  const [dataArray, setDataArray] = useState(null)
  //Scene for the post making process
  const [selectedTopic, setSelectedTopic] = useState(null)
  const s = new Spotify()
  const token = props.auth.token
  s.setAccessToken(token)

  useEffect(() => {
    if (props.specifier) {
      setValue(props.specifier)
      // eslint-disable-next-line default-case
      switch (props.specifier) {
        case "artist":
          setRadioDisabledStatus([false, true, true])
          break
        case "album":
          setRadioDisabledStatus([true, false, true])
          break
        case "track":
          setRadioDisabledStatus([true, true, false])
          break
      }
    }
  }, [])

  //functions
  useEffect(() => {
    searchTextChanged($("#searchText").val())
  }, [props, value])

  const searchTextChanged = event => {
    setError(null)
    if (gettingToken) return
    if (new Date().getTime() > props.auth.expires) {
      setGettingToken(true)
      setCallback([searchTextChanged, [event]])
      props.getNewToken(props.auth.rtoken)
    }
    s.setAccessToken(props.auth.token)
    //if the event is empty, dont display anything for search results
    if (!event || !event?.target?.value) {
      setDataArray(null)
      setReturnedData(null)
      return
    }
    //rather a string or an event is passed in, this just makes temp = the string
    let temp = typeof event == "string" ? event : event?.target?.value

    if (value === "artist") {
      searchArtists(temp)
    } else if (value === "album") {
      searchAlbums(temp)
    } else if (value === "track") {
      searchSongs(temp)
    }
  }

  const radioChanged = event => {
    setValue(event.target.value)
  }

  //Searches Spotify API for Artist
  const searchArtists = query => {
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
        }
      })
      .catch(err => {
        console.error(err)
        setError("Could not get data.")
      })
  }

  //Searches Spotify API for album
  const searchAlbums = async query => {
    try {
      const limit = 5
      const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${limit}`, {
        method: "GET",
        headers: {Authorization: "Bearer " + props.auth.token}
      })
      const data = await result.json()
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
      }
    } catch {
      setError("Could not get data.")
    }
  }

  //Searches Spotify API for song
  const searchSongs = query => {
    let prev = s.searchTracks(query, {limit: 5})
    prev.then(
      function (data) {
        // clean the promise so it doesn't call abort
        prev = null
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
      },
      function (err) {
        console.error(err)

        setError("Could not get data.")
      }
    )
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth>
      <DialogContent style={{overflowY: "scroll"}}>
        <Grid container>
          <Grid xs={12}>
            <Card align="center" style={{minHeight: "85vh"}}>
              <CardHeader title={<Typography variant="h4">SEARCH {value.toUpperCase()}S</Typography>} style={{backgroundColor: "#D99E2A"}} />
              <FormControl component="fieldset" style={{minWidth: "50%"}}>
                =======
                {!props.type ? (
                  <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                    <FormControlLabel value="artist" disabled={radioDisabledStatus[0]} control={<Radio />} label="Artist" />
                    <FormControlLabel value="album" disabled={radioDisabledStatus[1]} control={<Radio />} label="Album/EP" />
                    <FormControlLabel value="track" disabled={radioDisabledStatus[2]} control={<Radio />} label="Track" />
                  </RadioGroup>
                ) : null}
                <TextField variant="filled" id="searchText" onChange={searchTextChanged} autoFocus />
                <br />
                <Grid item xs={12}>
                  <Divider></Divider>
                </Grid>
                <br />
              </FormControl>
              <Grid container alignItems="center" justify="center" direction="column">
                {dataArray?.map((element, index) => {
                  return (
                    <>
                      <Grid item xs={6}>
                        <DisplayData element={element} id={index} maxHeight={"200px"} maxWidth={"200px"} onClick={props.onClick} />
                      </Grid>
                    </>
                  )
                })}
                {error && <Alert severity="error">{error}</Alert>}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="default">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  data: state.data,
  ui: state.ui
})

const mapDispatchToProps = {
  getNewToken
}

export default connect(mapStateToProps, mapDispatchToProps)(SpotifySearch)
