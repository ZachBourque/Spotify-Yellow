import React from 'react';
import { connect } from 'react-redux'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import queryString from "query-string"
import { logout } from "../redux/actions/authActions"
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import logo from "../assets/logo.ico"
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(50),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '80ch',
    },
  },
  sectionMobile: {
    display: 'flex',
    marginLeft: 50,
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

function PrimarySearchAppBar(props) {
  let { user, auth } = props
  const profileRe = () => {
    handleMenuClose()
    props.history.push("/profile")
  }
  const settingsRe = () => {
    handleMenuClose()
    props.history.push("/settings")
  }
  const classes = useStyles();
  const url = 'https://accounts.spotify.com/authorize?' +
  queryString.stringify({
    response_type: 'code',
    client_id: "e5f1276d07b74135956c8b3130f79f3f",
    scope: 'user-read-private user-read-email user-read-playback-state',
    redirect_uri: 'http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback'
  })
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    handleMenuClose()
    props.logout(props.history)
    window.location.reload()
  }
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={profileRe}>Profile</MenuItem>
      <MenuItem onClick={settingsRe}>Settings</MenuItem>
      <MenuItem onClick={logout}>Log Out</MenuItem>
    </Menu>
  );

  const [search, setSearch] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("")

  const searchChange = (e) => {
    setSearchTerm(e.target.value)
  } 

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const submitSearch = (e) => {
    e.preventDefault()
    if(!props.auth.token && search === 0){
      // proper error handling later
      console.log("cannot search spotify when not logged in")
    }
    props.history.push(`/search=${searchTerm}&id=${search}`)
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <a onClick={() => props.history.push("/")} style={{cursor: "pointer"}}><span>Spotify Yellow</span></a>
          </Typography>
          <form onSubmit={submitSearch}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={searchChange}
            />
          </div>
          </form>
        <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="demo-simple-select-filled-label">Search</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={search}
          onChange={handleChange}
        >
          <MenuItem value={0}>
           <img src={logo}/> 
          </MenuItem>
          <MenuItem value={1}><PersonIcon/></MenuItem>
          <MenuItem value={2}><CreateIcon/></MenuItem>
        </Select>
      </FormControl>       
      <div className={classes.grow}/>
            <div className={classes.sectionMobile}>
              {auth.loggedIn ? (
                <IconButton edge="end" aria-label="account of current user" aria-controls={menuId} aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                {!user.loaded ? <img src={localStorage.getItem("cachepfp")} width="50" heigh="50"/> : <img src={user.profilepic} width="50" heigh="50"/>}
                </IconButton>
              ) : 
              (<a href={url}>
           <Button variant="contained" type="button" >Login</Button>
           </a>)
              }

          </div>
  
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.user
})

const mapActionsToProps = {
    logout
}

export default connect(mapStateToProps, mapActionsToProps)(PrimarySearchAppBar)