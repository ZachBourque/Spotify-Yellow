import {useEffect, useState, Fragment} from "react"
import SettingsSkeleton from "../Skeletons/SettingsSkeleton"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"
import Typography from "@material-ui/core/Typography"
import FavoriteCard from "../components/FavoriteCard"
import AddIcon from "@material-ui/icons/Add"
import {connect} from "react-redux"
import {editBio, editFavorites, updateProfilePic, updateUsername, deleteUser} from "../redux/actions/userActions"
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
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import TextField from "@material-ui/core/TextField"
import Avatar from "@material-ui/core/Avatar"
import Alert from "@material-ui/lab/Alert"

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  favoriteText: {
    width: 325
  },
  favoriteHeight: {
    minHeight: 200
  }
}))

const Settings = props => {
  const classes = styles()
  const [loading, setLoading] = useState(true)
  const [pfp, setPfp] = useState(null)
  const [newBio, setNewBio] = useState(props.user.bio)
  const [newUsername, setNewUsername] = useState(props.user.username)
  const [bioOpen, setBioOpen] = useState(false)
  const [usernameOpen, setUsernameOpen] = useState(false)
  const [type, setType] = useState("")
  const [tempFavArtists, setTempFavArtists] = useState(props.user.favArtists)
  const [tempFavAlbums, setTempFavAlbums] = useState(props.user.favAlbums)
  const [tempFavSongs, setTempFavSongs] = useState(props.user.favSongs)

  const handleBioClick = () => {
    setBioOpen(prev => !prev)
  }

  const handleBioClickAway = () => {
    setNewBio(props.user.bio)
    setBioOpen(false)
  }

  const handleUsernameClickAway = () => {
    setNewUsername(props.user.username)
    setUsernameOpen(false)
  }

  const handleUsernameClick = () => {
    setUsernameOpen(prev => !prev)
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
  }, [props.user.loaded])

  useEffect(() => {
    setTempFavAlbums(props.user.favAlbums)
  }, [props.user.favAlbums])

  useEffect(() => {
    setTempFavArtists(props.user.favArtists)
  }, [props.user.favArtists])

  useEffect(() => {
    setTempFavSongs(props.user.favSongs)
  }, [props.user.favSongs])

  useEffect(() => {
    setNewBio(props.user.bio)
    handleBioClickAway()
  }, [props.user.bio])

  useEffect(() => {
    setNewUsername(props.user.username)
    handleUsernameClickAway()
  }, [props.user.username])

  useEffect(() => {
    setPfp(props.user.profilepic)
  }, [props.user.profilepic])

  const [dialog, setDialog] = useState(false)
  const submitBio = () => {
    props
      .editBio(document.getElementById("openBioInput").value)
      .then(() => {
        handleBioClickAway()
      })
      .catch(() => {
        setNewBio(props.user.bio)
      })
  }

  const submitUsername = () => {
    props
      .updateUsername(document.getElementById("openUsernameInput").value)
      .then(() => {
        handleUsernameClickAway()
      })
      .catch(() => {
        setNewUsername(props.user.username)
      })
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
    props.updateProfilePic(formData)
  }
  const cancelPfp = () => {
    setPfp(props.user.profilepic)
    $("#pfpInput").val("")
  }
  const searchArtist = () => {
    type !== "artist" ? setType("artist") : setDialog(true)
  }
  const searchAlbum = () => {
    type !== "album" ? setType("album") : setDialog(true)
  }
  const searchSong = () => {
    type !== "track" ? setType("track") : setDialog(true)
  }

  useEffect(() => {
    if (type !== "") {
      setDialog(true)
    }
  }, [type])

  const selectItem = item => {
    setDialog(false)
    let newArray = []
    // eslint-disable-next-line default-case
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
    props.editFavorites({favAlbums: [...tempFavAlbums]})
  }

  const submitFavSongs = () => {
    props.editFavorites({favSongs: [...tempFavSongs]})
  }

  const submitFavArtists = () => {
    props.editFavorites({favArtists: [...tempFavArtists]})
  }

  const submitFavorites = () => {
    props.editFavorites({favArtists: [...tempFavArtists], favAlbums: [...tempFavAlbums], favSongs: [...tempFavSongs]})
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

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(true)

  const openDeleteDialog = () => {
    setDeleteOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteOpen(false)
    setBtnDisabled(true)
  }

  return (
    <Container>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <Fragment>
          <Typography variant="h3" style={{textAlign: "center", marginTop: 20}}>
            Settings
          </Typography>
          <Grid container direction="row">
            <Grid item>
              <Avatar src={pfp} alt="cantfind" style={{width: "100%", height: 100}} />
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
              <h4 style={{marginRight: 5}}>Username:</h4>
            </Grid>
            <ClickAwayListener onClickAway={handleUsernameClickAway}>
              <Grid item>
                {!usernameOpen ? (
                  <Fragment>
                    <TextField autoComplete="off" defaultValue={newUsername} disabled multiline type="text" />
                    <IconButton className="button" onClick={handleUsernameClick}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <TextField type="text" onChange={() => setNewUsername($("openBioInput").val())} autoComplete="off" id="openUsernameInput" defaultValue={props.user.username} style={{width: 300}} />
                    <IconButton className="button" onClick={handleUsernameClick}>
                      <EditIcon color="primary" />
                    </IconButton>
                    {props.user.username !== newUsername && (
                      <Button type="button" onClick={submitUsername}>
                        Submit
                      </Button>
                    )}
                  </Fragment>
                )}
              </Grid>
            </ClickAwayListener>
          </Grid>
          {props.ui.errors.username && <Alert severity="error">{props.ui.errors.username}</Alert>}
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <h4 style={{marginRight: 5}}>Bio:</h4>
            </Grid>
            <ClickAwayListener onClickAway={handleBioClickAway}>
              <Grid item>
                {!bioOpen ? (
                  <Fragment>
                    <TextField autoComplete="off" defaultValue={newBio} disabled multiline type="text" />
                    <IconButton className="button" onClick={handleBioClick}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <TextField type="text" onChange={() => setNewBio($("openBioInput").val())} autoComplete="off" id="openBioInput" defaultValue={props.user.bio} style={{width: 300}} />
                    <IconButton className="button" onClick={handleBioClick}>
                      <EditIcon color="primary" />
                    </IconButton>
                    {props.user.bio !== newBio && (
                      <Button type="button" onClick={submitBio}>
                        Submit
                      </Button>
                    )}
                  </Fragment>
                )}
              </Grid>
            </ClickAwayListener>
          </Grid>
          {props.ui.errors.bio && <Alert severity="error">{props.ui.errors.bio}</Alert>}
          <Grid container direction="row" alignItems="center" spacing={3} className={classes.favoriteHeight}>
            <Grid container justify="center">
              {props.ui.errors.favorites && <Alert severity="error">{props.ui.errors.favorites}</Alert>}
            </Grid>
            <Grid item className={classes.favoriteText}>
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
              <Button type="button" onClick={() => setTempFavArtists(props.user.favArtists)}>
                Undo
              </Button>
            )}
          </Grid>
          <Grid container direction="row" alignItems="center" spacing={3} className={classes.favoriteHeight}>
            <Grid item className={classes.favoriteText}>
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
              <Button type="button" onClick={() => setTempFavAlbums(props.user.favAlbums)}>
                Undo
              </Button>
            )}
          </Grid>
          <Grid container direction="row" alignItems="center" spacing={3} className={classes.favoriteHeight}>
            <Grid item className={classes.favoriteText}>
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
              <Button type="button" onClick={() => setTempFavSongs(props.user.favSongs)}>
                Undo
              </Button>
            )}
          </Grid>
          <Dialog onClose={() => setDialog(false)} aria-labelledby="customized-dialog-title" open={dialog} maxWidth="md" fullWidth>
            <DialogContent>
              <Grid container justify="center">
                <Grid item>
                  <SpotifySearch onClose={() => setDialog(false)} aria-labelledby="customized-dialog-title" open={dialog} maxWidth="md" fullWidth specifier={type} onClick={selectItem} />
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Fragment>
      )}
      <div style={{textAlign: "center", marginTop: 20}}>
        {tempFavArtists !== props.user.favArtists || tempFavAlbums !== props.user.favAlbums || tempFavSongs !== props.user.favSongs ? (
          <Button type="button" onClick={submitFavorites}>
            Save
          </Button>
        ) : (
          <Button type="button" disabled>
            Save
          </Button>
        )}
      </div>
      <Button type="button" variant="contained" onClick={openDeleteDialog} style={{marginTop: 40, marginBottom: 50}}>
        Delete Account
      </Button>
      <Dialog open={deleteOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>Once you delete your account, your data cannot be recovered. You can, however, make a new account with the same spotify at any time.</DialogContentText>
          <DialogContentText>Please type "confirm" to confirm your account deletion.</DialogContentText>
          <TextField
            autoFocus
            placeholder="confirm"
            id="confirmbox"
            onChange={text => {
              setBtnDisabled(text.target.value !== "confirm")
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button type="button" disabled={btnDisabled} onClick={props.deleteUser}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
  updateProfilePic,
  updateUsername,
  deleteUser
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)
