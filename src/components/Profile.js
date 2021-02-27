import React, { Component, useState } from 'react'
import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';




const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
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

const Profile = ({ userData }) => {
    const classes = useStyles();

    return (
        <div>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={userData ? userData.images[0].url : ''} style={{ borderRadius: '10%' }} />
                        </ButtonBase>
                    </Grid>
                    
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="h4">
                                    {userData?.display_name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper>

        </div>
    )
}

export default Profile
