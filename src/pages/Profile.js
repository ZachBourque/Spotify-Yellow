import React, { Component, useState } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';


import MakePost from 'C:\\Users\\3tern\\code\\spotify-yellow\\src\\components\\MakePost'


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
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

const Profile = ({ userData, token }) => {
    //State and Globals for the Profile
    const classes = useStyles();
    
    return (
        <div name={classes.root}>

            <Grid container>

                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={userData ? (userData.images.length > 0 ? userData.images[0].url : '') : ''} style={{ borderRadius: '10%' }} />
                        </ButtonBase>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h4">
                                        {userData?.display_name}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Paper>
                </Grid>

            </Grid>

        <MakePost userData={userData} token={token}/>
        </div>
    )
}

export default Profile
