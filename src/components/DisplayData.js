import React, { Component, useState, useEffect } from 'react'
import { Container, Avatar, Grid, Card, Typography, CardMedia, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        textAlign: 'center',
        maxWidth: '300px',
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

const DisplayData = ({ element, id, onClick, maxHeight, maxWidth }) => {

    const classes = useStyles();


    return (
        <Card
            onClick={() => onClick(element)}
            styles={classes.paper}
            style={{ cursor: 'pointer', marginBottom: '10px'}}
            id={id}
        >
            <CardMedia
                style={{
                    maxHeight: maxHeight,
                    maxWidth: maxWidth,
                }}
                src={element?.image || 'https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg'}
                component="img" />
            <CardContent>
                {
                    element?.artistName && (
                        <>
                            <Typography variant="h4" id={id}>Artist:</Typography>
                            {element.artistName.map((e, i) => {
                                return <Typography variant="body1">{e}{i == element.artistName.length - 1 ? '' : ', '}</Typography>
                            })}
                        </>
                    )
                }
                {
                    element?.albumName && (
                        <>
                            <Typography variant="h4" id={id}>Album:</Typography>
                            <Typography variant="body1">{element.albumName}</Typography>
                        </>
                    )
                }
                {
                    element?.songName && (
                        <>
                            <Typography variant="h4" id={id}>Track:</Typography>
                            <Typography variant="body1">{element.songName}</Typography>
                        </>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default DisplayData
