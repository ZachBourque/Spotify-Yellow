import { Component, Fragment } from "react"
import { connect } from "react-redux"
import { Avatar, Grid, Typography, Divider, CardHeader, CardMedia, CardContent, CardActions, IconButton, Card, Menu, MenuItem } from "@material-ui/core"
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
import { Comment, Share, MoreVert, Create, Delete } from "@material-ui/icons"
import { deletePost, editPost } from "../redux/actions/dataActions"
import { reloadUserProfile } from "../redux/actions/userActions"
import LikeButton from "../components/LikeButton"
import { openSendMusicDialog, openMakePostDialog, openEditPostDialog, openDeleteDialog, openLoginDialog } from "../redux/actions/UIActions"

const styles = theme => ({
    header: {
        backgroundColor: "#FFBB35"
    }
})

export class Post extends Component {
    state = {
        element: this.props.element,
        menuOpen: null,
        makePostStatus: false,
        deletePostStatus: false,
        editPostStatus: false,
        newRating: this.props.element.rating,
        newTitle: this.props.element.title,
        newBody: this.props.element.body,
        switchState: this.props.element.rating > -1 ? true : false
    }

    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten]

    componentDidMount() {
        this.setState({ element: this.props.element })
    }

    handleClick = event => {
        this.setState({ menuOpen: event.currentTarget })
    }

    handleClose = () => {
        this.setState({ menuOpen: null })
    }

    handleSwitchChange = event => {
        this.setState({ switchState: !this.state.switchState })
    }

    handleTitleChange = e => {
        this.setState({ newTitle: e.target.value })
    }

    handleBodyChange = e => {
        this.setState({ newBody: e.target.value })
    }

    userRe = id => {
        this.props.history.push(`/profile=${id}`)
    }

    postRe = (id, comment) => {
        if (comment) {
            this.props.history.push(`/post/${id}#comment`)
        } else {
            this.props.history.push(`/post/${id}`)
        }
    }

    sharePost() {
        console.log(window.location.href)
        if (navigator.share) {
            let title = this.props.element.title;
            let url = window.location.href
            navigator.share({
                title,
                url
            }).then(() => {
                console.log("NICE!")
            }).catch(() => {
                alert("Sorry, an error occurred while trying to share 😞")
            })
        }
    }

    editPost(postId, newTitle, newBody, newRating) {
        const { title, body, rating } = this.props.element
        const { token, expires, rtoken } = this.props.auth
        let changes = {}
        if (title !== newTitle) {
            changes.title = newTitle
        }
        if (body !== newBody) {
            changes.body = newBody
        }
        if (rating !== newRating) {
            changes.rating = newRating
        }
        if (JSON.stringify(changes) === "{}") {
            return
        }

        this.props.editPost(postId, { update: changes }, token, expires, rtoken)
        this.setState({ element: { ...this.state.element, ...changes } })
        this.closeEditPost()
    }

    deletePost(postId) {
        const { token, expires, rtoken } = this.props.auth
        this.props.deletePost(postId, token, expires, rtoken)
    }

    checkOpenMakePost = () => {
        if (this.props.auth.loggedIn) {
            let { element } = this.props
            this.props.openMakePostDialog({ type: element.type, id: element.spotifyid, artistName: element.artist, albumName: element.album, songName: element.track, image: element.pic })
        } else {
            this.props.openLoginDialog()
        }
    }

    checkOpenSendMusic = () => {
        if (this.props.auth.loggedIn) {
            let { element } = this.props
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



    render() {
        let { element } = this.props
        return (
            <Card style={{ backgroundColor: "#4d4d4d" }} align="center">
                <CardHeader
                    avatar={<Avatar src={element.pfp} style={{ cursor: "pointer" }} onClick={() => this.userRe(element.authorid)} />}
                    action={
                        <Fragment>
                            <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                <MoreVert />
                            </IconButton>
                            <Menu id="simple-menu" anchorEl={this.state.menuOpen} keepMounted open={Boolean(this.state.menuOpen)} onClose={this.handleClose}>
                                <MenuItem onClick={() => this.checkOpenMakePost({ type: element.type, id: element.spotifyid, artistName: element.artist, albumName: element.album, songName: element.track, image: element.pic })}>Make Post On Topic</MenuItem>
                                <MenuItem
                                    onClick={() =>
                                        this.props.openSendMusicDialog({
                                            type: element.type,
                                            id: element.spotifyid,
                                            artistName: element.artist,
                                            albumName: element.album,
                                            songName: element.track,
                                            image: element.pic,
                                            url: `https://open.spotify.com/${element.type}/${element.spotifyid}`
                                        })
                                    }
                                >
                                    Recommend Topic To Someone
                                </MenuItem>
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
                    title={
                        <Typography variant="body1" style={{ cursor: "pointer", width: "fit-content" }} onClick={() => this.userRe(element.authorid)}>
                            {element.username}
                        </Typography>
                    }
                    style={{ backgroundColor: "#D99E2A" }}
                />
                {/* Main Content */}
                <CardContent>
                    <div onClick={() => this.postRe(element.postId)} style={{ cursor: "pointer" }}>
                        <Grid container alignItems="center" justify="center" direction="row">
                            {/* Left Half */}
                            <Grid item xs={6} md={2}>
                                <CardMedia id="theImage" image={element.pic} component="img" />
                            </Grid>
                            {element.rating > -1 && (
                                <Grid item xs={6} md={2}>
                                    <CardMedia image={this.imagesArray[element.rating]} component="img" />
                                </Grid>
                            )}
                            <Grid item md={2}>
                                <Grid container direction="column" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography variant="body1">
                                            {element.artist.map?.((e, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        {e}
                                                        {i === element.artist.length - 1 ? "" : ", "}
                                                    </Fragment>
                                                )
                                            }) || element.artist}
                                        </Typography>
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
                            <Grid xs={12} md={6} item style={{ backgroundColor: "#2f2f2f", borderRadius: "5%" }}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" style={{ maxWidth: "75%" }}>
                                        {element.title}
                                    </Typography>
                                </Grid>
                                <Grid item align="center"  >
                                    <Typography variant="body1" style={{
                                        "display": "-webkit-box",
                                        "max-width": "400px",
                                        "-webkit-line-clamp": "2",
                                        "-webkit-box-orient": "vertical",
                                        "overflow": "hidden"
                                    }}>
                                        {element.body}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                    <Divider style={{ margin: 10 }} />
                    <CardActions disableSpacing>
                        <LikeButton postId={element.postId} />
                        {element.likeCount}
                        <IconButton onClick={() => this.postRe(element.postId)}>
                            <Comment />
                        </IconButton>
                        <Typography variant="body2">{element.commentCount}</Typography>
                        <IconButton onClick={() => {this.sharePost()}}>
                            <Share />
                        </IconButton>
                    </CardActions>
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth,
    ui: state.ui
})

const mapActionsToProps = {
    reloadUserProfile,
    deletePost,
    editPost,
    openMakePostDialog,
    openEditPostDialog,
    openSendMusicDialog,
    openDeleteDialog,
    openLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, { withTheme: true })(Post))
