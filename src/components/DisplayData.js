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
import {connect} from "react-redux"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import {openMakePostDialog, closeMakePostDialog, openSendMusicDialog, closeSendMusicDialog} from "../redux/actions/UIActions"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
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

  const media = <CardMedia style={{maxWidth: ex ? null : maxWidth}} src={element?.image || "https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg"} component="img" />

  const content = (
    <Box sx={{display: "flex", flexDirection: "column"}}>
      <CardContent>
        <div style={{display: "flex"}}>
          <div style={{display: "block", overflow: "hidden", alignContent: ex ? "left" : "center", width: "100%"}}>
            {element?.artistName && (
              <Fragment>
                <Typography variant="h6" id={id}>
                  Artist:
                </Typography>
                <Typography variant="body1" noWrap gutterBottom>
                  {element.artistName.map((e, i) => {
                    return (
                      <span>
                        {e}
                        {i !== element.artistName.length - 1 && ", "}
                      </span>
                    )
                  })}
                </Typography>
              </Fragment>
            )}
            {element?.albumName && (
              <Fragment>
                <Typography variant="h6" id={id}>
                  Album:
                </Typography>
                <Typography variant="body1" noWrap gutterBottom>
                  {element.albumName}
                </Typography>
              </Fragment>
            )}
            {element?.songName && (
              <Fragment>
                <Typography variant="h6" id={id}>
                  Track:
                </Typography>
                <Typography variant="body1" noWrap gutterBottom>
                  {element.songName}
                </Typography>
              </Fragment>
            )}
          </div>
          <div className={classes.root} />
          {ex ? (
            <IconButton onClick={handleClick} style={{height: 48}}>
              <MoreVert />
            </IconButton>
          ) : null}
        </div>
      </CardContent>
    </Box>
  )

  return (
    <Fragment>
      <Card sx={{display: "flex"}} onClick={onClick ? () => onClick(element) : null} style={{cursor: "pointer", marginBottom: "10px", width: "100%"}} id={id}>
        <Grid container direction="row" alignItems="center">
          {ex ? (
            <Grid item xs={4}>
              {media}
            </Grid>
          ) : (
            <Fragment>{media}</Fragment>
          )}
          {ex ? (
            <Grid item xs={8}>
              {content}
            </Grid>
          ) : (
            <div style={{width: maxWidth}}>{content}</div>
          )}
        </Grid>
      </Card>
      {renderMenu}
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
