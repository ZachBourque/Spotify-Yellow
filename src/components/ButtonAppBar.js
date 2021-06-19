import React from 'react';
import { connect } from 'react-redux'
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import queryString from "query-string"

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
  const classes = useStyles();
  const url = 'https://accounts.spotify.com/authorize?' +
  queryString.stringify({
    response_type: 'code',
    client_id: "e5f1276d07b74135956c8b3130f79f3f",
    scope: 'user-read-private user-read-email user-read-playback-state',
    redirect_uri: 'http://localhost:5000/spotify-yellow-282e0/us-central1/api/callback'
  })

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <button type="button" onClick={() => props.history.push("/")}>
            Spotify Yellow
            </button>
          </Typography>
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
            />
          </div>
          <div className={classes.grow}/>
            <div className={classes.sectionMobile}>
              {props.user.loggedIn ? (
                <button type="button" style={{background: 'transparent', border: 'none'}} onClick={() => {props.history.push('/profile')}}>
                <img src={props.user.pfp} width="50" />
                </button>
              ) : 
              (<a href={url}>
           <Button variant="contained" type="button" >Login</Button>
           </a>)
              }

          </div>
  
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, mapActionsToProps)(PrimarySearchAppBar)