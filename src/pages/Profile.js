import React, { Component } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"
import { getProfileData, getUserProfileData } from "../redux/actions/profileActions"
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import queryString from "query-string"
import { TimerSharp } from '@material-ui/icons';
import PropTypes from "prop-types"


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
                <Grid container>

                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <ButtonBase className={classes.image}>
                            <img alt='nope' src={this.state.pfp} width="100" style={{ borderRadius: '10%' }} />
                        </ButtonBase>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h4">
                                        {this.state.username}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>

            </Grid>
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


