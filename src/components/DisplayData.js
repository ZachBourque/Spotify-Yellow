import {useState, useEffect, Fragment} from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import {makeStyles} from "@material-ui/core/styles"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreVert from "@material-ui/icons/MoreVert"
import SendMusicDialog from "./SendMusicDialog"
import PostOnTopicDialog from "./MakePostDialog"
import {connect} from "react-redux"
import {openMakePostDialog, closeMakePostDialog, openSendMusicDialog, closeSendMusicDialog} from "../redux/actions/UIActions"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    textAlign: "center",
    maxWidth: "300px"
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
  }
}))

const DisplayData = props => {
  const {element, id, onClick, maxHeight, maxWidth, ex} = props
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const copyLink = () => {
    let url = `https://open.spotify.com/${element.type}/${element.id}`
    navigator.clipboard.writeText(url).then(() => {
      handleClose()
    })
  }

  const renderMenu = (
    <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={copyLink}>Copy Link</MenuItem>
      <MenuItem
        onClick={() =>
          props.openSendMusicDialog({
            type: element.type,
            id: element.spotifyid,
            artistName: element.artist,
            albumName: element.album,
            songName: element.track,
            image: element.pic,
            url: `https://open.spotify.com/${element.type}/${element.spotifyid}`
          })
        }
      >
        Send to user
      </MenuItem>
      <MenuItem onClick={() => props.openMakePostDialog({type: element.type, id: element.spotifyid, artistName: element.artist, albumName: element.album, songName: element.track, image: element.pic})}>Make post on topic</MenuItem>
    </Menu>
  )

  return (
    <Fragment>
      <Card onClick={onClick ? () => onClick(element) : null} styles={classes.paper} style={{cursor: "pointer", marginBottom: "10px"}} id={id}>
        <CardMedia
          style={{
            maxHeight: maxHeight,
            maxWidth: maxWidth
          }}
          src={element?.image || "https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg"}
          component="img"
        />
        <CardContent>
          {element?.artistName && (
            <Fragment>
              <Typography variant="h4" id={id}>
                Artist:
              </Typography>
              {element.artistName.map((e, i) => {
                return (
                  <Typography variant="body1">
                    {e}
                    {i == element.artistName.length - 1 ? "" : ", "}
                  </Typography>
                )
              })}
            </Fragment>
          )}
          {element?.albumName && (
            <Fragment>
              <Typography variant="h4" id={id}>
                Album:
              </Typography>
              <Typography variant="body1">{element.albumName}</Typography>
            </Fragment>
          )}
          {element?.songName && (
            <Fragment>
              <Typography variant="h4" id={id}>
                Track:
              </Typography>
              <Typography variant="body1">{element.songName}</Typography>
            </Fragment>
          )}
          {ex ? (
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
          ) : null}
          {renderMenu}
        </CardContent>
      </Card>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapActionsToProps = {
  openMakePostDialog,
  openSendMusicDialog
}

export default connect(mapStateToProps, mapActionsToProps)(DisplayData)
