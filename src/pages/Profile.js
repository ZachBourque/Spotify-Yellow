import React, {Component, Fragment} from "react"
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"
import {connect} from "react-redux"
import withStyles from "@material-ui/core/styles/withStyles"
import queryString from "query-string"
import PropTypes from "prop-types"
import SmallPost from "../components/SmallPost"
import {setCurrent} from "../redux/actions/dataActions"
import axios from "axios"
import FavoriteCard from "../components/FavoriteCard"
import Alert from "@material-ui/lab/Alert"

const styles = theme => ({
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
  card: {
    width: 110
  },
  song: {
    width: 110
  },
  cardstyle: {
    width: 200,
    maxWidth: 200,
    margin: "auto",
    flexDirection: "column"
  },
  button: {
    maxWidth: 200
  }
})

class Profile extends Component {
  state = {
    profilepic: null,
    posts: null,
    favAlbums: null,
    favSongs: null,
    favArtists: null,
    bio: null,
    username: null,
    id: null,
    loading: true,
    self: false,
    error: null
  }

  componentDidMount() {
    const {state} = this.props.location
    if (state && state.setData) {
      this.props.setCurrent(state.user.posts)
      this.setState({...state.user, loading: false, self: true})
      this.props.location.state = {}
    } else {
      let id = queryString.parse(this.props.location.pathname)["/profile"]
      if (!id) {
        this.props.history.push("/")
      } else if (id === this.props.user.id) {
        this.props.setCurrent(this.props.user.posts)
        this.setState({...this.props.user, loading: false, self: true})
      } else {
        this.getProfileData(id)
      }
    }
  }

  componentDidUpdate(prevProps) {
    let id = queryString.parse(this.props.location.pathname)["/profile"]
    if (id !== this.state.id) {
      this.getProfileData(id)
    } else if (prevProps.user !== this.props.user && this.state.self && this.props.user.loaded) {
      this.props.setCurrent(this.props.user.posts)
      this.setState({...this.props.user, loading: false, self: true})
    }
  }

  getProfileData = id => {
    this.setState({loading: true, id})
    axios
      .get(`/getUser/${id}`)
      .then(res => {
        this.props.setCurrent(res.data.posts)
        if (res.data.id === this.props.user.id) {
          this.setState({...res.data, loading: false, self: true})
        } else {
          this.setState({...res.data, loading: false})
        }
      })
      .catch(err => {
        console.error(err)
        err?.response?.data?.error ? this.setState({loading: false, error: err.response.data.error}) : this.setState({loading: false, error: "An unknown error has occured"})
      })
  }

  getPosts = () => {
    let arr = []
    if (this.state.posts) {
      this.state.posts.forEach(post => arr.push({...post}))
      return arr
    } else {
      return []
    }
  }

  render() {
    return (
      <Fragment>
        {this.state.loading ? (
          <ProfileSkeleton />
        ) : this.state.error ? (
          <Alert severity="error" style={{justifyContent: "center"}}>
            {this.state.error}
          </Alert>
        ) : (
          <Grid container spacing={1} alignItems="center" justify="center">
            <div style={{marginTop: 15}}>
              <Grid container alignItems="center" justify="center" spacing={3}>
                <Grid item>
                  <Avatar alt="nope" src={this.state.profilepic} style={{width: 64, height: 64}} />
                </Grid>
                <Grid item>
                  <Typography gutterBottom variant="h3">
                    {this.state.username}
                  </Typography>
                </Grid>
              </Grid>
              {this.state.bio.length > 0 && (
                <Grid container alignItems="center" justify="center">
                  {this.state.bio.split("\n").map((line, idx) => {
                    return <p key={idx}>{line}</p>
                  })}
                </Grid>
              )}
              {this.state.favArtists.length > 0 && (
                <Fragment>
                  <Typography variant="h4" style={{textAlign: "center"}}>
                    Favourite Artists:
                  </Typography>
                  <Grid container direction="row" align="center" justify="center">
                    <Grid item xs={8} sm={12}>
                      {this.state.favArtists.map((artist, idx) => {
                        return <FavoriteCard key={idx} name={artist.name} url={artist.url} pic={artist.pic} />
                      })}
                    </Grid>
                  </Grid>
                </Fragment>
              )}
              {this.state.favAlbums.length > 0 && (
                <Fragment>
                  <Typography variant="h4" style={{textAlign: "center"}}>
                    Favourite Albums:
                  </Typography>
                  <Grid container direction="row" align="center" justify="center">
                    <Grid item xs={8} sm={12}>
                      {this.state.favAlbums.map((album, idx) => {
                        return <FavoriteCard key={idx} name={album.name} url={album.url} pic={album.pic} />
                      })}
                    </Grid>
                  </Grid>
                </Fragment>
              )}
              {this.state.favSongs.length > 0 && (
                <Fragment>
                  <Typography variant="h4" style={{textAlign: "center"}}>
                    Favourite Songs:
                  </Typography>
                  <Grid container direction="row" align="center" justify="center">
                    <Grid item xs={8} sm={12}>
                      {this.state.favSongs.map((song, idx) => {
                        return <FavoriteCard key={idx} name={song.name} url={song.url} pic={song.pic} />
                      })}
                    </Grid>
                  </Grid>
                </Fragment>
              )}
              {/*User's Posts container*/}
              <Grid container spacing={3} align="center" justify="center" style={{marginBottom: 30}}>
                {!this.props.data.loading &&
                  this.props.data.loaded &&
                  this.props.data.posts.map(post => {
                    return (
                      <Grid item xs={12} sm={8} md={7}>
                        <SmallPost element={post} history={this.props.history} key={post.postId} />
                      </Grid>
                    )
                  })}
              </Grid>
            </div>
          </Grid>
        )}
      </Fragment>
    )
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  data: state.data
})

const mapActionsToProps = {
  setCurrent
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, {withTheme: true})(Profile))
