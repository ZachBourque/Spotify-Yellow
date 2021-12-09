import React, {Component, Fragment} from "react"
import {Container, Avatar, Grid, Paper, Typography} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import Button from "@material-ui/core/ButtonBase"
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"
import {connect} from "react-redux"
import withStyles from "@material-ui/core/styles/withStyles"
import queryString from "query-string"
import {AlbumOutlined, TimerSharp} from "@material-ui/icons"
import PropTypes from "prop-types"
import SmallPost from "../components/SmallPost"
import MakePost from "../components/MakePost"
import Card from "@material-ui/core/Card"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import {sizing} from "@material-ui/system"
import {setCurrent} from "../redux/actions/dataActions"
import axios from "axios"
import FavoriteCard from "../components/FavoriteCard"

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
    const {classes} = this.props
    return (
      <Fragment>
        {this.state.loading ? (
          <ProfileSkeleton />
        ) : this.state.error ? (
          <Typography variant="body1">{this.state.error}</Typography>
        ) : (
          <Grid container spacing={3} align="center">
            <div style={{marginTop: 15}}>
              <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
                <Grid item>
                  <Avatar alt="nope" src={this.state.profilepic} style={{width: "100%", height: 100}} />
                </Grid>
                <Typography gutterBottom variant="h3">
                  {this.state.username}
                </Typography>
              </Grid>
              {this.state.bio.length > 0 ? (
                <Grid container alignItems="center" justify="center">
                  {this.state.bio.split("\n").map((line, idx) => {
                    return <p key={idx}>{line}</p>
                  })}
                </Grid>
              ) : null}
              <Container>
                {this.state.favArtists.length > 0 ? (
                  <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                    <Grid item>
                      <Typography variant="h4">Favourite Artists:</Typography>
                    </Grid>
                    <Grid item>
                      {this.state.favArtists.map((artist, idx) => {
                        return <FavoriteCard key={idx} name={artist.name} url={artist.url} pic={artist.pic} />
                      })}
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="h4">User does not have any favorite artists.</Typography>
                )}
                {this.state.favAlbums.length > 0 ? (
                  <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                    <Grid item>
                      <Typography variant="h4">Favourite Albums:</Typography>
                    </Grid>
                    <Grid item>
                      {this.state.favAlbums.map((album, idx) => {
                        return <FavoriteCard key={idx} name={album.name} url={album.url} pic={album.pic} />
                      })}
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="h4">User does not have any favorite albums.</Typography>
                )}
                {this.state.favSongs.length > 0 ? (
                  <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                    <Grid item>
                      <Typography variant="h4">Favourite Songs:</Typography>
                    </Grid>
                    <Grid item>
                      {this.state.favSongs.map((song, idx) => {
                        return <FavoriteCard key={idx} name={song.name} url={song.url} pic={song.pic} />
                      })}
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="h4">User does not have any favorite songs.</Typography>
                )}
              </Container>
              {/*User's Posts container*/}
              <Grid container spacing={3} align="center">
                {!this.props.data.loading &&
                  this.props.data.loaded &&
                  this.props.data.posts.map(post => {
                    return (
                      <Grid item xs={12}>
                        <Grid item xs={6}>
                          <SmallPost element={post} history={this.props.history} key={post.postId} />
                        </Grid>
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
