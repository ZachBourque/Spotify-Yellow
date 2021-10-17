import {useEffect, useState, Fragment} from "react"
import SettingsSkeleton from "../Skeletons/SettingsSkeleton"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Typography from "@material-ui/core/Typography"
import FavoriteCard from "../components/FavoriteCard"
import AddIcon from "@material-ui/icons/Add"
import withStyles from "@material-ui/core/styles/withStyles"
import {connect} from "react-redux"
import {editBio, editFavorites, updateProfilePic} from "../redux/actions/userActions"
import {makeStyles} from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import EditIcon from "@material-ui/icons/Edit"
import $ from "jquery"
import SpotifySearch from "../components/SpotifySearch"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import TextField from "@material-ui/core/TextField"

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}))

const Settings = props => {
  const classes = styles()
  const [loading, setLoading] = useState(true)
  const [pfp, setPfp] = useState(null)
  const [newBio, setNewBio] = useState(props.user.bio)
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(null)
  const [tempFavArtists, setTempFavArtists] = useState(props.user.favArtists)
  const [tempFavAlbums, setTempFavAlbums] = useState(props.user.favAlbums)
  const [tempFavSongs, setTempFavSongs] = useState(props.user.favSongs)

  const handleClick = () => {
    setOpen(prev => !prev)
  }

  const handleClickAway = () => {
    console.log("click away")
    setNewBio(props.user.bio)
    setOpen(false)
  }

  useEffect(() => {
    if (!props.auth.loggedIn) {
      props.history.replace("/")
    }
  }, [])

  useEffect(() => {
    if (props.user.loaded && loading) {
      setLoading(false)
    }
    setPfp(props.user.profilepic)
    setNewBio(props.user.bio)
  }, [props])
  useEffect(() => {
    setTempFavAlbums(props.user.favAlbums)
  }, [props.user.favAlbums])
  useEffect(() => {
    setTempFavArtists(props.user.favArtists)
  }, [props.user.favArtists])
  useEffect(() => {
    setTempFavSongs(props.user.favSongs)
  }, [props.user.favSongs])
  const [dialog, setDialog] = useState(false)
  const submitBio = () => {
    //validate data first
    setNewBio(document.getElementById("openBioInput").value)
    handleClick()
    props.editBio(document.getElementById("openBioInput").value, props.auth.token, props.auth.expires, props.auth.rtoken, props.history)
  }
  const pfpChange = () => {
    var file = $("#pfpInput").prop("files")[0]
    if (file.type.includes("image")) {
      setPfp(URL.createObjectURL(file))
    }
  }
  const clickFileButton = () => {
    const input = document.getElementById("pfpInput")
    input.click()
  }
  const submitPfp = () => {
    var file = $("#pfpInput").prop("files")[0]
    let formData = new FormData()
    formData.append("image", file, file.name)
    props.updateProfilePic(props.auth.token, props.auth.expires, props.auth.rtoken, formData)
  }
  const cancelPfp = () => {
    setPfp(props.user.profilepic)
    $("#pfpInput").val("")
  }
  const searchArtist = () => {
    setType("artist")
    setDialog(true)
  }
  const searchAlbum = () => {
    setType("album")
    setDialog(true)
  }
  const searchSong = () => {
    setType("track")
    setDialog(true)
  }

  const selectItem = item => {
    setDialog(false)
    let newArray = []
    switch (item.type) {
      case "artist":
        newArray = [...tempFavArtists]
        newArray.push({name: item.artistName[0], url: `https://open.spotify.com/album/${item.id}`, pic: item.image})
        setTempFavArtists(newArray)
        break
      case "album":
        newArray = [...tempFavAlbums]
        newArray.push({name: item.albumName, url: `https://open.spotify.com/album/${item.id}`, pic: item.image})
        setTempFavAlbums(newArray)
        break
      case "track":
        newArray = [...tempFavSongs]
        newArray.push({name: item.songName, url: `https://open.spotify.com/album/${item.id}`, pic: item.image})
        setTempFavSongs(newArray)
        break
    }
  }
  const submitFavAlbums = () => {
    props.editFavorites({favAlbums: [...tempFavAlbums]}, props.auth.token, props.auth.expires, props.auth.rtoken)
  }
  const submitFavSongs = () => {
    props.editFavorites({favSongs: [...tempFavSongs]}, props.auth.token, props.auth.expires, props.auth.rtoken)
  }
  const submitFavArtists = () => {
    props.editFavorites({favArtists: [...tempFavArtists]}, props.auth.token, props.auth.expires, props.auth.rtoken)
  }
  const removeAlbum = album => {
    let arr = tempFavAlbums.filter(a => {
      return a.name !== album.name
    })
    setTempFavAlbums(arr)
  }
  const removeSong = song => {
    let arr = tempFavSongs.filter(a => {
      return a.name !== song.name
    })
    setTempFavSongs(arr)
  }
  const removeArtist = artist => {
    let arr = tempFavArtists.filter(a => {
      return a.name !== artist.name
    })
    setTempFavArtists(arr)
  }
  return (
    <Container>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <Fragment>
          <h1>Settings</h1>
          <Grid container direction="row">
            <Grid item>
              <img src={pfp} alt="cantfind" width="100" />
            </Grid>
            <Grid item>
              <input type="file" id="pfpInput" hidden="hidden" onChange={pfpChange} />
              <IconButton onClick={clickFileButton} className="button">
                <EditIcon color="primary" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid item>
              <img src={pfp} alt="cantfind" width="100" />
            </Grid>
            <Grid item>
              <input type="file" id="pfpInput" hidden="hidden" onChange={pfpChange} />
              <IconButton onClick={clickFileButton} className="button">
                <EditIcon color="primary" />
              </IconButton>
            </Grid>
          </Grid>
          {pfp !== props.user.profilepic && (
            <Fragment>
              <Button type="button" onClick={cancelPfp}>
                Cancel
              </Button>
              <Button type="button" onClick={submitPfp}>
                Submit
              </Button>
            </Fragment>
          )}
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <h4 style={{marginRight: 5}}>Bio:</h4>
            </Grid>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Grid item>
                <Fragment>
                  {!open && (
                    <Fragment>
                      <TextField autoComplete="off" defaultValue={newBio} disabled multiline type="text" />
                      <IconButton className="button" onClick={handleClick}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Fragment>
                  )}
                  {open && (
                    <Fragment>
                      <TextField type="text" onChange={() => setNewBio($("openBioInput").val())} autoComplete="off" id="openBioInput" defaultValue={props.user.bio} style={{width: 300}} />
                      <IconButton className="button" onClick={handleClick}>
                        <EditIcon color="primary" />
                      </IconButton>
                      {props.user.bio !== newBio && (
                        <Button type="button" onClick={submitBio}>
                          Submit
                        </Button>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              </Grid>
            </ClickAwayListener>
          </Grid>
          {props.ui.errors.bio && <Typography variant="body1">{props.ui.errors.bio}</Typography>}
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid container justify="center">
              {props.ui.errors.favorites && <Typography variant="body1">{props.ui.errors.favorites}</Typography>}
            </Grid>
            <Grid item>
              <Typography variant="h4">Favourite Artists:</Typography>
            </Grid>
            <Grid item>
              {tempFavArtists.map((artist, idx) => {
                return (
                  <Fragment key={idx}>
                    <FavoriteCard name={artist.name} url={artist.url} pic={artist.pic} />
                    <IconButton className="button" onClick={() => removeArtist(artist)}>
                      <HighlightOffIcon />
                    </IconButton>
                  </Fragment>
                )
              })}
            </Grid>
            {tempFavArtists.length < 3 && (
              <Grid item>
                <IconButton className="button" onClick={searchArtist}>
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
            {tempFavArtists !== props.user.favArtists && (
              <Fragment>
                <Button type="button" onClick={submitFavArtists}>
                  Save
                </Button>
                <Button type="button" onClick={() => setTempFavArtists(props.user.favArtists)}>
                  Undo
                </Button>{" "}
              </Fragment>
            )}
          </Grid>
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid item>
              <Typography variant="h4">Favourite Albums:</Typography>
            </Grid>
            <Grid item>
              {tempFavAlbums.map((album, idx) => {
                return (
                  <Fragment key={idx}>
                    <FavoriteCard name={album.name} url={album.url} pic={album.pic} />
                    <IconButton className="button" onClick={() => removeAlbum(album)}>
                      <HighlightOffIcon />
                    </IconButton>
                  </Fragment>
                )
              })}
            </Grid>
            {tempFavAlbums.length < 3 && (
              <Grid item>
                <IconButton className="button" onClick={searchAlbum}>
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
            {tempFavAlbums !== props.user.favAlbums && (
              <Fragment>
                <Button type="button" onClick={submitFavAlbums}>
                  Save
                </Button>
                <Button type="button" onClick={() => setTempFavAlbums(props.user.favAlbums)}>
                  Undo
                </Button>{" "}
              </Fragment>
            )}
          </Grid>
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid item>
              <Typography variant="h4">Favourite Songs:</Typography>
            </Grid>
            <Grid item>
              {tempFavSongs.map((song, idx) => {
                return (
                  <Fragment key={idx}>
                    <FavoriteCard name={song.name} url={song.url} pic={song.pic} />
                    <IconButton className="button" onClick={() => removeSong(song)}>
                      <HighlightOffIcon />
                    </IconButton>
                  </Fragment>
                )
              })}
            </Grid>
            {tempFavSongs.length < 3 && (
              <Grid item>
                <IconButton className="button" onClick={searchSong}>
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
            {tempFavSongs !== props.user.favSongs && (
              <Fragment>
                <Button type="button" onClick={submitFavSongs}>
                  Save
                </Button>
                <Button type="button" onClick={() => setTempFavSongs(props.user.favSongs)}>
                  Undo
                </Button>{" "}
              </Fragment>
            )}
          </Grid>
          <Dialog onClose={() => setDialog(false)} aria-labelledby="customized-dialog-title" open={dialog} maxWidth="md" fullWidth>
            <DialogContent>
              <Grid container justify="center">
                <Grid item>
                  <SpotifySearch onClick={selectItem} type={type} />
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Fragment>
      )}
    </Container>
  )
}

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  ui: state.ui
})

const mapActionsToProps = {
  editBio,
  editFavorites,
  updateProfilePic
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)
