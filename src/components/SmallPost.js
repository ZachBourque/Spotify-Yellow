import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Avatar, Grid, Paper, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Card, Menu, MenuItem, Button } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import $ from 'jquery'
import Zero from '../assets/0.png'
import One from '../assets/1.png'
import Two from '../assets/2.png'
import Three from '../assets/3.png'
import Four from '../assets/4.png'
import Five from '../assets/5.png'
import Six from '../assets/6.png'
import Seven from '../assets/7.png'
import Eight from '../assets/8.png'
import Nine from '../assets/9.png'
import Ten from '../assets/10.png'
import withStyles from '@material-ui/core/styles/withStyles'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThumbUp, Comment, Share, MoreVert, Create, Delete } from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import MakePost from './MakePost';


const styles = makeStyles(theme => ({

    header: {
        backgroundColor: '#FFBB35',
    }

}))

export class Post extends Component {

    state = {
        content: null,
        menuOpen: null,
        makePostOpen: false,
        deletePostOpen: false,
    }

    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten];

    handleClick = (event) => {
        this.setState({ menuOpen: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ menuOpen: null });
    };

    userRe = (id) => {
        this.props.history.push(`/profile=${id}`)
    }

    postRe = (id, comment) => {
        if (comment) {
            this.props.history.push(`/post/${id}#comment`)
        } else {
            this.props.history.push(`/post/${id}`)
        }

    }

    handleLike = () => {
        //TODO send post like to database
    }

    openMakePost() {
        this.setState({ makePostOpen: true })
    }

    closeMakePost = () => {
        this.setState({ makePostOpen: false });
    };

    sharePost() {
        //TODO
    }

    editPost() {
        //TODO
    }

    openDeletePost() {
        this.setState({ deletePostOpen: true })
    }

    closeDeletePost = () => {
        this.setState({ deletePostOpen: false })
    }

    deletePost() {
        //TODO
    }

    render() {
        const { classes, element, postId } = this.props
        return (
            <>
                <Card style={{ backgroundColor: "#4d4d4d" }} align="center">
                    <CardHeader
                        avatar={
                            <Avatar src={element.pfp} style={{ cursor: 'pointer' }} onClick={() => this.userRe(element.authorid)} />
                        }
                        action={
                            <>
                                <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.menuOpen}
                                    keepMounted
                                    open={Boolean(this.state.menuOpen)}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={() => { this.handleClose(); this.openMakePost(); }}>Make Post On Topic</MenuItem>
                                    <MenuItem onClick={() => { this.handleClose(); this.sharePost(); }}>Share</MenuItem>
                                    {element.authorid == this.props.user.id ? <MenuItem onClick={() => { this.handleClose(); this.editPost(); }}><Create />Edit Post</MenuItem> : ''}
                                    {element.authorid == this.props.user.id ? <MenuItem onClick={() => { this.handleClose(); this.openDeletePost(); }} style={{ color: 'red' }}><Delete />Delete Post</MenuItem> : ''}
                                </Menu>
                            </>
                        }
                        title={
                            <Typography variant="body1" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => this.userRe(element.authorid)}>
                                {element.username}
                            </Typography>
                        }
                        style={
                            { backgroundColor: "#D99E2A" }
                        }
                    />
                    {/* Main Content */console.log(element)}
                    <CardContent>
                        <div onClick={() => this.postRe(element.postId)} style={{ cursor: 'pointer' }}>

                            <Grid container alignItems="center" justify="flex-start" direction="row">
                                {/* Left Half */}
                                <Grid item md={2}>
                                    <CardMedia id="theImage" image={element.pic} component="img" />
                                </Grid>
                                {element.rating > -1 &&
                                    <Grid item md={2}>
                                        <CardMedia image={this.imagesArray[element.rating]} component="img" />
                                    </Grid>
                                }
                                <Grid item md={2}>
                                    <Grid container direction="column" justify="space-between" alignItems="center">
                                        <Grid item>
                                            <Typography variant="body1">{element.artist.map?.((e, i) => {
                                                return <>{e}{i == element.artist.length - 1 ? '' : ', '}</>
                                            }) || element.artist}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">{element.album}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">{element.track}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Right Half */}
                                <Grid md={6} item alignContent="center" justify="space-around" direction="column" style={{ backgroundColor: '#2f2f2f', borderRadius: '5%' }}>
                                    <Grid item>
                                        <Typography variant="h5" style={{ maxWidth: '75%' }}>{element.title}</Typography>
                                    </Grid>
                                    <Grid item>
                                        {element.body.split("\n").map(line => { return <Typography align="center" style={{ maxWidth: '75%' }}>{line}</Typography> })}
                                    </Grid>
                                </Grid>


                            </Grid>
                        </div>
                        <Divider style={{ margin: 10 }} />
                        <CardActions disableSpacing>
                            <IconButton onClick={this.handleLike()}>
                                <ThumbUp />
                            </IconButton>
                            <IconButton onClick={() => this.postRe(element.postId)}>
                                <Comment />
                            </IconButton>
                            <IconButton >
                                <Share />
                            </IconButton>

                        </CardActions>

                    </CardContent>


                </Card>
                {/* MakePost Dialog Box */}
                <Dialog onClose={this.closeMakePost} aria-labelledby="customized-dialog-title" open={this.state.makePostOpen} maxWidth="md" fullWidth>
                    <DialogContent >
                        <Grid container justify="center">
                            <Grid item>
                                <MakePost selectedTopic={{
                                    type: element.type,
                                    id: element.spotifyid,
                                    artistName: element.artist,
                                    albumName: element.album,
                                    songName: element.track,
                                    image: element.pic,
                                }} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>

                {/* DeletePost Dialog */}
                <Dialog
                    open={this.state.deletePostOpen}
                    onClose={this.closeDeletePost}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this post?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Once this post is deleted, it cannot be recovered.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDeletePost} variant="outlined"> 
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={this.closeDeletePost}
                            startIcon={<Delete />}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {

}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post))
