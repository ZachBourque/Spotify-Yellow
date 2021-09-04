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

const DisplayData = ({element, id, onClick, maxHeight, maxWidth, ex}) => {
  console.log(element)
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

  const sendToUser = () => {}

  const makePost = () => {}

  const renderMenu = (
    <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={copyLink}>Copy Link</MenuItem>
      <MenuItem onClick={sendToUser}>Send to user</MenuItem>
      <MenuItem onClick={makePost}>Make post on topic</MenuItem>
    </Menu>
  )

  return (
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
  )
}

export default DisplayData
