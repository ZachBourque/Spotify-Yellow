import { Component, Fragment } from "react"
import { connect } from "react-redux"
import { Menu, MenuItem, Avatar, Grid, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, IconButton, Card, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"
import clsx from "clsx"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MoreVert from "@material-ui/icons/MoreVert"
import Delete from "@material-ui/icons/Delete"
import Create from "@material-ui/icons/Create"
import Zero from "../assets/0.png"
import One from "../assets/1.png"
import Two from "../assets/2.png"
import Three from "../assets/3.png"
import Four from "../assets/4.png"
import Five from "../assets/5.png"
import Six from "../assets/6.png"
import Seven from "../assets/7.png"
import Eight from "../assets/8.png"
import Nine from "../assets/9.png"
import Ten from "../assets/10.png"
import withStyles from "@material-ui/core/styles/withStyles"
import { makeStyles, createMuiTheme } from "@material-ui/core/styles"
import axios from "axios"
import Comment from "./Comment"
import CommentIcon from "@material-ui/icons/Comment"
import $ from "jquery"
import { deletePost, editPost, setCurrentPost } from "../redux/actions/dataActions"
import { reloadUserProfile } from "../redux/actions/userActions"
import LikeButton from "./LikeButton"
import { openMakeCommentDialog, openMakePostDialog, openEditPostDialog, openDeleteDialog, openSendMusicDialog, openLoginDialog } from "../redux/actions/UIActions"
import BigPostSkeleton from "../Skeletons/BigPostSkeleton"



const styles = theme => ({
    header: {
        backgroundColor: "#FFBB35"
    }
})

export class Post extends Component {
    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten]

    state = {
        isLoading: true,
        menuOpen: false,
        error: null
    }

    componentDidMount() {
        const id = this.props.match.params.postID
        this.props
            .setCurrentPost(id)
            .then(() => {
                this.setState({ isLoading: false })
            })
            .catch(() => {
                this.setState({ error: "Could not get post." })
            })
    }

    handleClick = event => {
        this.setState({ menuOpen: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ menuOpen: null })
    }

    checkOpenMakePost = () => {
        if (this.props.auth.loggedIn) {
            let element = this.props.data.posts[0]
            this.props.openMakePostDialog({
                type: element.type,
                id: element.spotifyid,
                artistName:
                    element.artist,
                albumName: element.album,
                songName: element.track,
                image: element.pic
            })
        } else {
            this.props.openLoginDialog()
        }
    }

    checkOpenSendMusic = () => {
        if (this.props.auth.loggedIn) {
            let element = this.props.data.posts[0]
            this.props.openSendMusicDialog({
                type: element.type,
                id: element.spotifyid,
                artistName: element.artist,
                albumName: element.album,
                songName: element.track,
                image: element.pic,
                url: `https://open.spotify.com/${element.type}/${element.spotifyid}`
            })
        } else {
            this.props.openLoginDialog()
        }
    }

    sharePost() {
        //TODO
    }
    userRe = id => {
        this.props.history.push(`/profile=${id}`)
    }
    headerStyles = {
        //background: "linear-gradient(to left, #43444D, #000333)"
        backgroundColor: "#43444D",
    }



    render() {
        const element = this.props.data.posts[0]
        return (
            <>
                <div style={this.headerStyles}>
                    <CardHeader
                        avatar={
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                <Avatar src={element.pfp} style={{ cursor: "pointer" }} onClick={() => this.userRe(element.authorid)} />
                                </Grid>
                                <Grid item>
                                <Typography style={{ cursor: "pointer" }} onClick={() => this.userRe(element.authorid)}>{element.username}</Typography>
                                </Grid>
                            </Grid>}
                        action={

                            <Fragment>
                                <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                    <MoreVert />
                                </IconButton>
                                <Menu id="simple-menu" anchorEl={this.state.menuOpen} keepMounted open={Boolean(this.state.menuOpen)} onClose={this.handleClose}>
                                    <MenuItem onClick={this.checkOpenMakePost}>Make Post On Topic</MenuItem>
                                    <MenuItem onClick={this.checkOpenSendMusic}>Recommend Topic To Someone</MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            this.handleClose()
                                            this.sharePost()
                                        }}
                                    >
                                        Share
                                    </MenuItem>
                                    {element.authorid === this.props.user.id && (
                                        
                                        <MenuItem onClick={() => this.props.openEditPostDialog(element)}>
                                            <Create />
                                            Edit Post
                                        </MenuItem>
                                    )}
                                    {element.authorid === this.props.user.id && (
                                        <MenuItem onClick={() => this.props.openDeleteDialog(element)} style={{ color: "red" }}>
                                            <Delete />
                                            Delete Post
                                        </MenuItem>
                                    )}
                                </Menu>
                            </Fragment>
                        }
                    />
                    <CardContent >
                        <Grid container alignItems="center" justify="center" direction="row">
                            <Grid item xs={3}>
                                <a href={`https://open.spotify.com/${element.type}/${element.spotifyid}`}>
                                    <CardMedia image={element.pic} component="img" style={{ maxWidth: "275px" }} />
                                </a>
                            </Grid>

                            <Grid item xs={3} >
                                <Typography variant="h4" align="center" style={{ width: "fit-content", borderRadius: "5%" }}>
                                    {element.artist.map?.((e, i) => {
                                        return (
                                            <Fragment>
                                                {e}
                                                {i === element.artist.length - 1 ? "" : ", "}
                                            </Fragment>
                                        )
                                    }) || element.artist}
                                </Typography>
                                <Grid item xs={12}>
                                    <Typography variant="h4" align="center" style={{ width: "fit-content", borderRadius: "5%" }}>
                                        {element.album}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h4" align="center" style={{ width: "fit-content", borderRadius: "5%" }}>
                                        {element.track}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                                <CardMedia image={this.imagesArray[element.rating]} component="img" style={{ maxWidth: "200px" }} />
                            </Grid>
                        </Grid>
                    </CardContent>

                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth,
    data: state.data,
    ui: state.ui
})

const mapActionsToProps = {
    reloadUserProfile: reloadUserProfile,
    deletePost,
    editPost,
    setCurrentPost,
    openMakeCommentDialog,
    openMakePostDialog,
    openDeleteDialog,
    openEditPostDialog,
    openSendMusicDialog,
    openLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, { withTheme: true })(Post))
