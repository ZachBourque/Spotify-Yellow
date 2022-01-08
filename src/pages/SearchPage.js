import {Button, Grid, Typography} from "@material-ui/core"
import UserCardSkeleton from "../Skeletons/UserCardSkeleton"
import DisplayDataSkeleton from "../Skeletons/DisplayDataSkeleton"
import UserCard from "../components/UserCard"
import {Component, Fragment} from "react"
import {connect} from "react-redux"
import queryString from "query-string"
import Spotify from "spotify-web-api-js"
import axios from "axios"
import {getNewToken} from "../redux/actions/authActions"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import DisplayData from "../components/DisplayData"
import SmallPost from "../components/SmallPost"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import {setCurrent, setDataLoading, getFeedData} from "../redux/actions/dataActions"
import FavoriteCard from "../components/FavoriteCard"
import SmallPostSkeleton from "../Skeletons/SmallPostSkeleton"
import Alert from "@material-ui/lab/Alert"

class SearchPage extends Component {
  state = {
    data: [],
    error: null,
    loading: true,
    query: queryString.parse(this.props.location.search)["query"],
    id: parseInt(queryString.parse(this.props.location.search)["id"]),
    filter: 0,
    radioState: 0,
    users: this.props.data.users,
    posts: null,
    items: null,
    searched: false,
    s: new Spotify().setAccessToken(this.props.auth.token),
    callback: [],
    gettingToken: false
  }

  handleRadioChange = event => {
    this.props.history.push(`/search?query=${this.state.query}&id=${this.state.id}&filter=${event.target.value}`)
  }

  search = async (query, id, filter) => {
    this.setLoading()
    query = query.toLowerCase()
    let display = []
    switch (id) {
      case 1:
        let {expires, rtoken, token, loggedIn} = this.props.auth

        if (!loggedIn) {
          this.setState({error: "Cannot search spotify when not logged in.", loading: false})
          return
        }
        if (this.state.gettingToken) return
        if (new Date().getTime() > expires) {
          this.setState({gettingToken: true, callback: [search, [query, id, filter]]})
          this.props.getNewToken(rtoken)
        }
        let s = new Spotify()
        s.setAccessToken(token)
        switch (filter) {
          case 0:
            s.searchArtists(query, {limit: 10})
              .then(artists => {
                artists.artists.items.forEach(artist => {
                  display.push({type: "artist", id: artist.id, artistName: [artist.name], albumName: null, songName: null, image: artist.images[0]?.url})
                })
                return this.setDisplay(display)
              })
              .catch(err => {
                console.error(err)
                this.setState({error: "Error getting data"})
              })
            break
          case 1:
            fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=${10}`, {
              method: "GET",
              headers: {Authorization: "Bearer " + this.props.auth.token}
            })
              .then(res => {
                return res.json()
              })
              .then(data => {
                if (data.albums) {
                  data.albums.items.forEach(album => {
                    display.push({type: "album", id: album.id, artistName: album.artists.map(e => e.name), albumName: album.name, songName: null, image: album.images[0]?.url})
                  })
                  return this.setDisplay(display)
                }
              })
              .catch(err => {
                console.error(err)
                this.setState({loading: false, error: "Error getting data"})
              })
            break
          case 2:
            s.searchTracks(query, {limit: 10}).then(data => {
              data.tracks.items.forEach(song => {
                display.push({type: "track", id: song.id, artistName: song.artists.map(e => e.name), albumName: song.album.name, songName: song.name, image: song.album.images[0].url})
              })
              return this.setDisplay(display)
            })
            break
        }
        break
      case 2:
        let users = this.state.users
        switch (filter) {
          case 0:
            display = [...users.filter(a => a.username.toLowerCase().includes(query))]
            return this.setDisplay(display)
          case 1:
            display = [...users.filter(a => a.bio.toLowerCase().includes(query))]
            return this.setDisplay(display)
        }
        break
      case 0:
        let posts = this.state.posts
        switch (filter) {
          case 0:
            display = [...posts.filter(a => a.title.toLowerCase().includes(query))]
            return this.setDisplay(display)
          case 1:
            display = [...posts.filter(a => a.body.toLowerCase().includes(query))]
            return this.setDisplay(display)
          case 2:
            display = [...posts.filter(a => a.topic.toLowerCase().includes(query))]
            return this.setDisplay(display)
          case 3:
            display = [...posts.filter(a => a.type.toLowerCase().includes(query))]
            return this.setDisplay(display)
        }
        break
    }
  }

  setDisplay = display => {
    this.setState({data: display, loading: false, error: null})
  }

  setLoading = () => {
    this.setState({data: [], loading: true, error: null})
  }

  componentDidUpdate() {
    if (!this.state.users && this.props.data.users) {
      this.setState({users: this.props.data.users})
    }
    if (!this.state.posts && this.props.data.posts?.length > 0) {
      this.setState({posts: this.props.data.posts})
    }
    if (!this.state.users || !this.state.posts) {
      return
    }
    let query = queryString.parse(this.props.location.search)["query"]
    let id = parseInt(queryString.parse(this.props.location.search)["id"])
    let filter = parseInt(queryString.parse(this.props.location.search)["filter"])
    if (!this.state.searched || query !== this.state.query || id !== this.state.id || filter !== this.state.filter) {
      this.setState({query, id, filter, loading: true, searched: true})
      this.props.history.push(`/search?query=${query}&id=${id}&filter=${filter}`)
      this.search(query, id, filter)
    }
  }

  componentWillReceiveProps(prevProps) {
    if (prevProps.auth.token !== this.props.auth.token) {
      this.state.gettingToken = false
      this.setState({gettingToken: false})
      this.state.callback[0](...this.state.callback[1])
    }
  }

  componentDidMount = () => {
    this.props.setCurrent([])
    this.props.getFeedData()
  }

  tabChange = (event, newValue) => {
    this.props.history.push(`/search?query=${this.state.query}&id=${newValue}&filter=${0}`)
  }

  render() {
    let radioArr = [
      <Fragment>
        <FormControlLabel value={0} control={<Radio />} label="Title" />
        <FormControlLabel value={1} control={<Radio />} label="Body" />
        <FormControlLabel value={2} control={<Radio />} label="Topic" />
        <FormControlLabel value={3} control={<Radio />} label="Type" />
      </Fragment>,
      <Fragment>
        <FormControlLabel value={0} control={<Radio />} label="Artist" />
        <FormControlLabel value={1} control={<Radio />} label="Album/EP" />
        <FormControlLabel value={2} control={<Radio />} label="Track" />
      </Fragment>,
      <Fragment>
        <FormControlLabel value={0} control={<Radio />} label="Username" />
        <FormControlLabel value={1} control={<Radio />} label="Bio" />
      </Fragment>
    ]
    return (
      <Grid container>
        <Grid item sm />
        <Grid item md={6}>
          <AppBar position="static" color="default">
            <Tabs value={this.state.id} onChange={this.tabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
              <Tab label="Posts" />
              <Tab label="Spotify" />
              <Tab label="Users" />
            </Tabs>
          </AppBar>
          {this.state.error ? (
            <Alert severity="error" style={{justifyContent: "center"}}>
              {this.state.error}
            </Alert>
          ) : this.state.loading === false && this.state.data.length === 0 ? (
            <h2 style={{textAlign: "center"}}>No Results</h2>
          ) : (
            <Fragment>
              {this.state.id === 0 &&
                (this.state.loading ? (
                  <Fragment>
                    {Array.from({length: 5}).map((e, i) => {
                      return <SmallPostSkeleton key={i} />
                    })}
                  </Fragment>
                ) : (
                  this.state.data.map((item, idx) => {
                    return <SmallPost element={item} history={this.props.history} key={idx} postId={item.postId} />
                  })
                ))}
              {this.state.id === 1 && (
                <Grid container>
                  {this.state.loading ? (
                    <Fragment>
                      {Array.from({length: 10}).map((e, i) => {
                        return (
                          <Grid item xs={12} xl={6}>
                            <DisplayDataSkeleton key={i} ex maxWidth={"400px"} height="225px" id={this.state.filter} />
                          </Grid>
                        )
                      })}
                    </Fragment>
                  ) : (
                    this.state.data.map((item, idx) => {
                      return (
                        <Grid item xs={12} xl={6} style={{alignSelf: "center", height: 225}}>
                          <DisplayData element={item} id={idx} height={"225px"} maxWidth={"400px"} key={idx} onClick={() => window.open(`https://open.spotify.com/${item.type}/${item.id}`)} ex={true} />
                        </Grid>
                      )
                    })
                  )}
                </Grid>
              )}
              {this.state.id === 2 && (
                <Grid container>
                  {this.state.loading ? (
                    <Fragment>
                      {Array.from({length: 30}).map((e, i) => {
                        return (
                          <Grid item xs={4}>
                            <UserCardSkeleton key={i} />
                          </Grid>
                        )
                      })}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {this.state.data.slice(0, 30).map((item, idx) => {
                        return (
                          <Grid item xs={4}>
                            <UserCard user={item} key={idx} />
                          </Grid>
                        )
                      })}
                    </Fragment>
                  )}
                </Grid>
              )}
            </Fragment>
          )}
        </Grid>
        <Grid item sm>
          <div style={{marginLeft: 20}}>
            <RadioGroup aria-label="gender" name="gender1" value={this.state.filter} onChange={this.handleRadioChange}>
              {radioArr[this.state.id || 0]}
            </RadioGroup>
          </div>
        </Grid>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  data: state.data
})

const mapActionsToProps = {
  setDataLoading,
  getNewToken,
  setCurrent,
  getFeedData
}

export default connect(mapStateToProps, mapActionsToProps)(SearchPage)
