import React, { Component, useState } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import ProfileSkeleton from "../Skeletons/ProfileSkeleton"
import { getProfileData, getUserProfileData } from "../redux/actions/profileActions"
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import queryString from "query-string"
import MakePost from "../components/MakePost"

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
    componentDidMount() {
        if(this.props.user.token && !this.props.profile.id){
            if(queryString.parse(this.props.location.pathname)['/profile'] && (queryString.parse(this.props.location.pathname)['/profile'] !== this.props.profile.id) ){
                this.props.getProfileData(queryString.parse(this.props.location.pathname)['/profile'])
            } else {
                console.log(this.props.user.rtoken)
                this.props.getUserProfileData(this.props.user.token, this.props.user.expires, this.props.user.rtoken, this.props.history)
            }
        }
    }

    componentWillReceiveProps(props) {
        if(props.user.token && !props.profile.id){
            if(queryString.parse(props.location.pathname)['/profile']){
                props.getProfileData(queryString.parse(props.location.pathname)['/profile'])
            } else {
                props.getUserProfileData(props.user.token, props.user.expires, props.user.rtoken, props.history)
            }
        }
    }
    
    render(){
    const { classes } = this.props
    return (
        <div name={classes.root}>
            {this.props.profile.loading ? <ProfileSkeleton/> : (
                <Grid container>

                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <ButtonBase className={classes.image}>
                            <img alt='nope' src={this.props.profile.pfp} style={{ borderRadius: '10%' }} />
                        </ButtonBase>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h4">
                                        {this.props.profile.username}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>
                <MakePost />
            </Grid>
            )}

        </div>
    )
    }
}


const mapStateToProps = (state) => ({
    user: state.user,
    profile: state.profile
})

const mapActionsToProps = {
    getUserProfileData,
    getProfileData
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile))


