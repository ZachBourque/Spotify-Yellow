import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import {ArrowLeft} from "@material-ui/icons"
import {connect} from "react-redux"
import {closeMakePostDialog} from "../redux/actions/UIActions"
import {useState, useEffect} from "react"
import TextField from "@material-ui/core/TextField"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import {makeStyles} from "@material-ui/core"
import Switch from "@material-ui/core/Switch"
import Spotify from "spotify-web-api-js"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import Divider from "@material-ui/core/Divider"
import DisplayData from "./DisplayData"
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
import {getNewToken} from "../redux/actions/authActions"
import {makePost} from "../redux/actions/dataActions"
import Alert from "@material-ui/lab/Alert"

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

const MakePostDialog = props => {
  const classes = useStyles()
  const [gettingToken, setGettingToken] = useState(false)
  const [callback, setCallback] = useState([])
  //Scene 0:
  //Radio Button Value
  const [value, setValue] = useState("artist")
  const [searchValue, setSearchValue] = useState("")
  //Data returned from the Spotify API
  const [returnedData, setReturnedData] = useState(null)
  //Parsed data that is displayed to the user
  const [dataArray, setDataArray] = useState(null)
  //Scene for the post making process
  const [scene, setScene] = useState(0)
  const [searchError, setSearchError] = useState(null)
  //Scene 1:
  //An object from the dataArray that is the topic of the post
  const [selectedTopic, setSelectedTopic] = useState({})
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
    if (props.selectedTopic) {
      setSelectedTopic(props.selectedTopic)
      setScene(1)
    }
  }, [props.selectedTopic])

  useEffect(() => {
    searchTextChanged(searchValue)
  }, [value, searchValue])

  const handleSearchValueChange = event => {
    setSearchValue(event.target.value)
  }
  useEffect(() => {
    setGettingToken(false)
    if (callback[0] && callback[1]) {
      callback[0](...callback[1])
      setCallback([])
    }
  }, [props.auth.token])
  const radioChanged = event => {
    setValue(event.target.value)
  }

  const searchTextChanged = (event, radioValue = value) => {
    //rather a string or an event is passed in, this just makes temp = the string
    let temp = typeof event == "string" ? event : event?.target?.value
    //if the event is empty, dont display anything for search results
    if (!temp) {
      setDataArray(null)
      setReturnedData(null)
      return
    }

    if (radioValue === "artist") {
      searchArtists(temp)
    } else if (radioValue === "album") {
      searchAlbums(temp)
    } else if (radioValue === "track") {
      searchSongs(temp)
    }
  }

  //Searches Spotify API for Artist
  const searchArtists = query => {
    setSearchError(null)
    if (gettingToken) return
    if (new Date().getTime() > props.auth.expires) {
      setGettingToken(true)
      setCallback([searchArtists, [query]])
      props.getNewToken(props.auth.rtoken)
    }
    s.setAccessToken(props.auth.token)
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
    if (gettingToken) return
    if (new Date().getTime() > props.auth.expires) {
      setGettingToken(true)
      setCallback([searchAlbums, [query]])
      props.getNewToken(props.auth.rtoken)
    }
    const limit = 5
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${limit}`, {
      method: "GET",
      headers: {Authorization: "Bearer " + props.auth.token}
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
    if (gettingToken) return
    if (new Date().getTime() > props.auth.expires) {
      setGettingToken(true)
      setCallback([searchSongs, [query]])
      props.getNewToken(props.auth.rtoken)
    }
    s.setAccessToken(props.auth.token)
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
    props.makePost(newPost)
  }

  const handleSwitchChange = event => {
    setSwitchState(!switchState)
  }

  const handleBackButton = e => {
    setScene(0)
  }
    return (
      <Dialog onClose={props.closeMakePostDialog} aria-labelledby="customized-dialog-title" open={props.ui.makePost.open} maxWidth="md" fullWidth >
        <DialogContent>
          <Card style={{ backgroundColor: "#4d4d4d", "height": "100%" }} align="center">
            <CardHeader title={<Typography variant="h4">Make Post</Typography>} style={{ backgroundColor: "#D99E2A" }} />
            <CardContent>
              {scene === 0 && (
                <FormControl component="fieldset">
                  <Grid container justify="center" alignItems="center">
                    <RadioGroup aria-label="gender" name="gender1" value={value} onChange={radioChanged}>
                      <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                      <FormControlLabel value="album" control={<Radio />} label="Album/EP" />
                      <FormControlLabel value="track" control={<Radio />} label="Track" />
                    </RadioGroup>
                    <TextField variant="filled" id="searchText" value={searchValue} onChange={handleSearchValueChange} autoFocus />
                  </Grid>
                  <Divider style={{ margin: "10px" }} />
                  <Grid container justify="center" >
                    {searchError ? (
                      <Alert severity="error">{searchError}</Alert>
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
            {scene === 1 && (
              <div>
                <DisplayData element={selectedTopic} maxHeight={200} />
                <form id="contactForm">
                  <div>
                    <Switch checked={switchState} onChange={handleSwitchChange} name="useNumber" inputProps={{"aria-label": "secondary checkbox"}} />
                    {!switchState ? (
                      ""
                    ) : (
                      <div>
                        <img className={classes.rating} src={imagesArray[postRating]} alt="rating" />
                        <IconButton aria-label="minus" onClick={() => setRating(!(postRating === 0) ? postRating - 1 : postRating)}>
                          <RemoveIcon />
                        </IconButton>
                        <IconButton aria-label="plus" onClick={() => setRating(!(postRating === 10) ? postRating + 1 : postRating)}>
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
                {props.ui.errors.makePost && <Alert severity="error">{props.ui.errors.makePost}</Alert>}
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        {scene === 1 && (
          <Grid container justify="left">
            <Grid item>
              <IconButton onClick={handleBackButton}>
                <ArrowLeft />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <Button onClick={props.closeMakePostDialog} color="default">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  ui: state.ui
})

const mapActionsToProps = {
  closeMakePostDialog,
  makePost,
  getNewToken
}

export default connect(mapStateToProps, mapActionsToProps)(MakePostDialog)
