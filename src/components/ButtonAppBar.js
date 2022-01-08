import {Fragment, useState} from "react"
import {connect} from "react-redux"
import {fade, makeStyles} from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import InputBase from "@material-ui/core/InputBase"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"
import SearchIcon from "@material-ui/icons/Search"
import queryString from "query-string"
import {logout} from "../redux/actions/authActions"
import {markNotificationsRead} from "../redux/actions/userActions"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import InputLabel from "@material-ui/core/InputLabel"
import logo from "../assets/logo.ico"
import PersonIcon from "@material-ui/icons/Person"
import CreateIcon from "@material-ui/icons/Create"
import NotificationsIcon from "@material-ui/icons/Notifications"
import Badge from "@material-ui/core/Badge"
import Avatar from "@material-ui/core/Avatar"
import Notification from "./Notification"
import Box from "@material-ui/core/Box"
import MoreIcon from "@material-ui/icons/MoreVert"

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    marginLeft: 50,
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
}))

function NavBar(props) {
  let {user, auth} = props
  const redirect_uri = "https://us-central1-spotify-yellow-282e0.cloudfunctions.net/api/callback"
  //const redirect_uri = "http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback"
  const profileRe = () => {
    handleMenuClose()
    handleMobileMenuClose()
    props.history.push("/profile")
  }
  const settingsRe = () => {
    handleMenuClose()
    handleMobileMenuClose()
    props.history.push("/settings")
  }

  const classes = useStyles()
  const url =
    "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: "e5f1276d07b74135956c8b3130f79f3f",
      scope: "user-read-private user-read-email user-read-playback-state",
      redirect_uri
    })
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget)
  }
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const [notiEl, setNotiEl] = useState(null)
  const isNotiMenuOpen = Boolean(notiEl)
  const handleNotiMenuOpen = event => {
    let notRead = props.user.notifications ? props.user.notifications.filter(notification => !notification.read) : []
    if (notRead.length > 0) {
      let ids = []
      notRead.forEach(notification => ids.push(notification.notificationId))
      props.markNotificationsRead(ids)
    }
    setNotiEl(event.currentTarget)
  }
  const handleNotiMenuClose = () => {
    setNotiEl(null)
  }

  const logout = () => {
    handleMenuClose()
    window.location.href = "/logout"
  }
  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu anchorEl={anchorEl} anchorOrigin={{vertical: "top", horizontal: "right"}} id={menuId} keepMounted transformOrigin={{vertical: "top", horizontal: "right"}} open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={profileRe}>Profile</MenuItem>
      <MenuItem onClick={settingsRe}>Settings</MenuItem>
      <MenuItem onClick={logout}>Log Out</MenuItem>
    </Menu>
  )

  const notificationId = "notification-menu"
  const renderNotificationMenu = (
    <Menu anchorEl={notiEl} anchorOrigin={{vertical: "top", horizontal: "right"}} id={notificationId} keepMounted transformOrigin={{vertical: "top", horizontal: "right"}} open={isNotiMenuOpen} onClose={handleNotiMenuClose} style={{height: 500, overflowY: "scroll"}}>
      {props?.user?.notifications?.length > 0 ? (
        props?.user?.notifications?.map((notification, idx) => {
          return (
            <MenuItem key={idx}>
              <Notification notification={notification} />
            </MenuItem>
          )
        })
      ) : (
        <Typography variant="h6">You don't have any notifications.</Typography>
      )}
    </Menu>
  )

  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem style={{justifyContent: "center"}}>
        <Button
          type="button"
          onClick={() => {
            handleMobileMenuClose()
            props.history.push("/")
          }}
        >
          Home
        </Button>
      </MenuItem>
      <MenuItem style={{justifyContent: "center"}}>
        <IconButton aria-label="show new notifications" color="inherit" aria-controls={notificationId} aria-haspopup="true" onClick={handleNotiMenuOpen}>
          <Badge badgeContent={props?.user?.notifications?.filter(notification => !notification.read).length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem style={{justifyContent: "center"}}>
        {auth.loggedIn ? (
          <IconButton aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit" style={{width: 48, height: 48}}>
            {!user.loaded ? <Avatar src={localStorage.getItem("cachepfp")} /> : <Avatar src={user.profilepic} />}
          </IconButton>
        ) : (
          <a href={url}>
            <Button variant="contained" type="button">
              Login
            </Button>
          </a>
        )}
      </MenuItem>
    </Menu>
  )
  const [search, setSearch] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const searchChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleChange = event => {
    setSearch(event.target.value)
  }

  const submitSearch = e => {
    e.preventDefault()
    if (!props.auth.token && search === 1) {
      // proper error handling later
    }
    if (props.history.location.pathname.includes("search")) {
      const queryParams = queryString.parse(props.history.location.search)
      const newParams = {...queryParams, query: searchTerm}
      props.history.push({pathname: "/search", search: queryString.stringify(newParams)})
      return
    }
    props.history.push(`/search?query=${searchTerm}&id=${search}&filter=0`)
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <a onClick={() => props.history.push("/")} style={{cursor: "pointer"}}>
              <span>Spotify Yellow</span>
            </a>
          </Typography>
          <div className={classes.grow} />
          <form onSubmit={submitSearch}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{"aria-label": "search"}}
                onChange={searchChange}
              />
            </div>
          </form>
          <FormControl>
            <Select variant="outlined" value={search} onChange={handleChange} style={{width: 70}}>
              <MenuItem value={0}>
                <CreateIcon />
              </MenuItem>
              <MenuItem value={1}>
                <img src={logo} />
              </MenuItem>
              <MenuItem value={2}>
                <PersonIcon />
              </MenuItem>
            </Select>
          </FormControl>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {auth.loggedIn ? (
              <Fragment>
                <IconButton aria-label="show new notifications" color="inherit" aria-controls={notificationId} aria-haspopup="true" onClick={handleNotiMenuOpen}>
                  <Badge badgeContent={props?.user?.notifications?.filter(notification => !notification.read).length} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                  {!user.loaded ? <Avatar src={localStorage.getItem("cachepfp")} width="50" /> : <Avatar src={user.profilepic} width="50" />}
                </IconButton>
              </Fragment>
            ) : (
              <a href={url}>
                <Button variant="contained" type="button">
                  Login
                </Button>
              </a>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton size="large" aria-label="show more" aria-controls={mobileMenuId} aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationMenu}
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
})

const mapActionsToProps = {
  logout,
  markNotificationsRead
}

export default connect(mapStateToProps, mapActionsToProps)(NavBar)
