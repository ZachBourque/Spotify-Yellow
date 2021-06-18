import React, { Component, useState } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { connect } from 'react-redux'


import MakePost from '../components/MakePost'


const useStyles = makeStyles((theme) => ({
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
        maxWidth: '200px',
        maxHeight: '200px',
    },
}));

const Profile = (props) => {
    
    //State and Globals for the Profile
    const classes = useStyles();
    if (!props.user?.firebaseData?.profilepic) {window.location.href = 'localhost:3000'}
    return (
        <div name={classes.root}>

            <Grid container>

                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                            <img className={classes.img} alt="urmom" src={props.user?.firebaseData?.profilepic} />

                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>

                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>

            </Grid>

        <MakePost />
        </div>
    )
}


const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(Profile)
