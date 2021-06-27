import React, { Component } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/ButtonBase';
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"
import { getProfileData, getUserProfileData } from "../redux/actions/profileActions"
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import queryString from "query-string"
import { AlbumOutlined, TimerSharp } from '@material-ui/icons';
import PropTypes from "prop-types"
import Post from "../components/Post"
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { sizing } from '@material-ui/system';

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 1000,
        textAlign: 'center',
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
  card: {
      width: 110,
   },
   song: {
       width: 110
   },
   cardstyle:{
       width: 200,
       maxWidth: 200, 
        margin:'auto',
        flexDirection: 'column',
    },
    button: {
        maxWidth: 200 
    }



}));

class Profile extends Component {

    state = {
        pfp: null,
        posts: null,
        favAlbums: null,
        favSongs: null,
        favArtists: null,
        bio: null,
        username: null,
        id: null,
        loading: true
    }


    componentDidMount () {
        const { state } = this.props.location
        if(state && state.setData){
            this.setState({...state.user, loading: false})
        } else {
            let id = queryString.parse(this.props.location.pathname)['/profile']
            if(!id){
                this.props.history.push("/")
            } else if(id === this.props.profile.id){
                this.setState({...this.props.profile, loading: false })
            } else {
                this.props.getProfileData(id)
            }
        }
        
    }

    componentDidUpdate(){
        if(this.state.loading && this.props.profile.loaded){
            this.setState({
                loading: false, ...this.props.profile
            })
        }
    }

    render(){
    const { classes } = this.props
    return (
        <div name={classes.root}>
            {this.state.loading ? <ProfileSkeleton/> : (
                <div style={{marginTop: 15}}>
                    <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
                    <Grid item>
                            <img alt='nope' src={this.state.pfp} width="100" style={{ borderRadius: '10%' }} />
                        </Grid>
                            <Typography gutterBottom variant="h3">
                                        {this.state.username}
                                    </Typography>
                                    </Grid>
                    {this.state.bio.length > 0 ? (

                    <Grid container alignItems="center" justify="center">
                    {this.state.bio.split("\n").map((line, idx) => {
                        return(
                            <p key={idx}>{line}</p>
                        )
                    })}
                    </Grid>
                    ) : null}
                    <Container>
                    {this.state.favArtists.length > 0 ? (

                    <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                        <Grid item>
                            <Typography variant="h4">
                                Favourite Artists:  
                            </Typography>
                            </Grid>
                            <Grid item >
                            {this.state.favArtists.map((artist,idx) => {
                                return(
                                    <Button href={artist.url} target="_blank" style={{margin: 5, maxWidth: 200}} className={classes.button}>
                                       <Card className={classes.cardstyle}>
                                        <img src={artist.pic} width="110" style={{display: "block", marginLeft: "auto", marginRight: "auto", minWidth: 150}}/>
                                        <CardContent>
                                            <Typography variant="body1">
                                                {artist.name}
                                            </Typography>
                                        </CardContent>
                                        </Card> 
                                    </Button>
                                )
                            })}
                            </Grid>
                    </Grid>
                    ) : <Typography variant="h4">User does not have any favorite artists.</Typography>}
                    {this.state.favAlbums.length > 0 ? (
<Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                        <Grid item>
                            <Typography variant="h4">
                                Favourite Albums:  
                            </Typography>
                            </Grid>
                            <Grid item >
                            {this.state.favAlbums.map((album,idx) => {
                                return(
                                    <Button href={album.url} target="_blank" style={{margin: 5, maxWidth: 200 }} className={classes.button} >
                                       <Card className={classes.cardstyle}>
                                        <img src={album.pic} width="110" style={{display: "block", marginLeft: "auto", marginRight: "auto", minWidth: 150, maxWidth: 250, maxHeight: 215}}/>
                                        <CardContent>
                                            <Typography variant="body1">
                                                {album.name}
                                            </Typography>
                                        </CardContent>
                                        </Card> 
                                    </Button>
                                )
                            })}
                            </Grid>
                    </Grid>
                    ) : <Typography variant="h4">User does not have any favorite albums.</Typography>}
                    {this.state.favSongs.length > 0 ? (

<Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
                        <Grid item>
                            <Typography variant="h4">
                                Favourite Songs:  
                            </Typography>
                            </Grid>
                            <Grid item >
                            {this.state.favSongs.map((song,idx) => {
                                return(
                                    <Button href={song.url} target="_blank" style={{margin: 5, maxWidth: 200}} className={classes.button}>
                                       <Card className={classes.cardstyle}>
                                        <img src={song.pic} width="110" style={{display: "block", marginLeft: "auto", marginRight: "auto"}}/>
                                        <CardContent>
                                            <Typography variant="body1">
                                                {song.name}
                                            </Typography>
                                        </CardContent>
                                        </Card> 
                                    </Button>
                                )
                            })}
                            </Grid>
                    </Grid>
                    ) : <Typography variant="h4">User does not have any favorite songs.</Typography> }
</Container>
                {
                this.state.posts.reverse().map(post => {
                    return <Post element={post} history={this.props.history} key={post.postId}/>
                })}
</div>
            )}

        </div>
    )
    }
}

Profile.propTypes = {
    profile: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    profile: state.profile
})

const mapActionsToProps = {
    getProfileData
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))



