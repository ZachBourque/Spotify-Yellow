import {Component, Fragment} from "react"
import {connect} from "react-redux"
import {Menu, MenuItem, Avatar, Grid, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, IconButton, Card, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core"
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
import {makeStyles, createMuiTheme} from "@material-ui/core/styles"
import axios from "axios"
import Comment from "./Comment"
import MakePost from "./MakePost"
import CommentIcon from "@material-ui/icons/Comment"
import $ from "jquery"
import {deletePost, editPost, setCurrentPost} from "../redux/actions/dataActions"
import {reloadUserProfile} from "../redux/actions/userActions"
import EditPostDialog from "./EditPostDialog"
import DeletePostDialog from "./DeletePostDialog"
import MakeCommentDialog from "./MakeCommentDialog"
import {setCurrent, setDataLoading} from "../redux/actions/dataActions"
import LikeButton from "./LikeButton"
import {openMakeCommentDialog, closeMakeCommentDialog, openMakePostDialog, closeMakePostDialog, openEditPostDialog, closeEditPostDialog, openDeleteDialog, closeDeleteDialog, openSendMusicDialog, closeSendMusicDialog} from "../redux/actions/UIActions"
import PostOnTopicDialog from "./MakePostDialog"
import BigPostSkeleton from "../Skeletons/BigPostSkeleton"

const styles = makeStyles(theme => ({
  header: {
    backgroundColor: "#FFBB35"
  }
}))

export class Post extends Component {
  imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten]

  state = {
    isLoading: true
  }

  componentDidMount() {
    const id = this.props.match.params.postID
    //  this.props.makeComment(this.props.element.postId, this.props.auth.token, this.props.auth.expires, this.props.auth.rtoken, newComment)
    this.props.setCurrentPost(id).then(res => {
      this.setState({isLoading: false})
    })
  }

  userRe = id => {
    this.props.history.push(`/profile=${id}`)
  }

  updateElement = newElement => {
    this.setState({element: newElement})
  }

  handleClick = event => {
    this.setState({menuOpen: event.currentTarget})
  }

  handleClose = () => {
    this.setState({menuOpen: null})
  }

  sharePost() {
    //TODO
  }

  render() {
    const {classes} = this.props
    const element = this.props.data.posts[0]
    return this.state.isLoading ? (
      <BigPostSkeleton />
    ) : (
      <Fragment>
        <Grid container justify="center">
          <Grid item xs={6}>
            <Card style={{backgroundColor: "#4d4d4d"}} align="center">
              <CardHeader
                avatar={<Avatar src={element.pfp} style={{cursor: "pointer"}} onClick={() => this.userRe(element.authorid)} />}
                action={
                  <Fragment>
                    <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                      <MoreVert />
                    </IconButton>
                    <Menu id="simple-menu" anchorEl={this.state.menuOpen} keepMounted open={Boolean(this.state.menuOpen)} onClose={this.handleClose}>
                      <MenuItem onClick={this.props.openMakePostDialog}>Make Post On Topic</MenuItem>
                      <MenuItem onClick={this.props.openSendMusicDialog}>Recommend Topic To Someone</MenuItem>
                      <MenuItem
                        onClick={() => {
                          this.handleClose()
                          this.sharePost()
                        }}
                      >
                        Share
                      </MenuItem>
                      {element.authorid == this.props.user.id && (
                        <MenuItem onClick={this.props.openEditPostDialog}>
                          <Create />
                          Edit Post
                        </MenuItem>
                      )}
                      {element.authorid == this.props.user.id && (
                        <MenuItem onClick={this.props.openDeleteDialog} style={{color: "red"}}>
                          <Delete />
                          Delete Post
                        </MenuItem>
                      )}
                    </Menu>
                  </Fragment>
                }
                title={<Typography variant="h5">{element.username}</Typography>}
                style={{backgroundColor: "#D99E2A"}}
              />
              {/* Items before divider */}
              <CardContent>
                <Grid container alignItems="flex-start" justify="space-between" direction="row">
                  <Grid item xs={4}>
                    <a href={`https://open.spotify.com/${element.type}/${element.spotifyid}`}>
                      <CardMedia image={element.pic} component="img" style={{maxWidth: "250px"}} />
                    </a>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h4" align="center" style={{backgroundColor: "#002984", width: "fit-content", borderRadius: "5%"}}>
                      {element.artist.map?.((e, i) => {
                        return (
                          <Fragment>
                            {e}
                            {i == element.artist.length - 1 ? "" : ", "}
                          </Fragment>
                        )
                      }) || element.artist}
                    </Typography>
                    <Grid item xs={12}>
                      <Typography variant="h4" align="center" style={{backgroundColor: "#3f51b5", width: "fit-content", borderRadius: "5%"}}>
                        {element.album}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h4" align="center" style={{backgroundColor: "#757de8", width: "fit-content", borderRadius: "5%"}}>
                        {element.track}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <CardMedia image={this.imagesArray[element.rating]} component="img" style={{maxWidth: "150px"}} />
                  </Grid>
                </Grid>

                {/* Items After divider */}
                <Grid container justify="center" direction="row">
                  <Grid item xs={12}>
                    <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h3" align="center">
                      {element.title}
                    </Typography>
                  </Grid>
                  <Box style={{backgroundColor: "#363434", width: "80%"}} borderRadius={16}>
                    <Grid item xs={12}>
                      {!this.state.isLoading &&
                        element.body.split("\n").map(line => {
                          return (
                            <Typography variant="body1" align="center">
                              {line}
                            </Typography>
                          )
                        })}
                    </Grid>
                  </Box>
                </Grid>
                <CardActions disableSpacing>
                  <LikeButton postId={element.postId} />
                  {element.likeCount}
                  <IconButton onClick={this.props.openMakeCommentDialog}>
                    <CommentIcon />
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: this.state.expanded
                    })}
                    onClick={this.handleExpandClick}
                    aria-expanded={this.state.expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
              </CardContent>
            </Card>
            {element.comments.map((element, index) => {
              return <Comment element={element} key={index} history={this.props.history} />
            })}
          </Grid>
        </Grid>
        {/* MakeComment Dialog */}
        <MakeCommentDialog onClose={this.props.closeMakeCommentDialog} makeCommentState={this.props.ui.makeCommentOpen} element={element} />
        {/* MakePost Dialog Box */}
        <PostOnTopicDialog
          element={{
            type: element.type,
            id: element.spotifyid,
            artistName: element.artist,
            albumName: element.album,
            songName: element.track,
            image: element.pic,
            url: `https://open.spotify.com/${element.type}/${element.spotifyid}`
          }}
          open={this.props.ui.makePostOpen}
          onClose={this.props.closeMakePostDialog}
        />
        {/* <Dialog onClose={this.closeMakePost} aria-labelledby="customized-dialog-title" open={this.state.makePostStatus} maxWidth="md" fullWidth>

          <DialogContent>
            <Grid container justify="center">
              <Grid item>
                <MakePost
                  selectedTopic={{
                    type: element.type,
                    id: element.spotifyid,
                    artistName: element.artist,
                    albumName: element.album,
                    songName: element.track,
                    image: element.pic,
                    url: `https://open.spotify.com/${element.type}/${element.spotifyid}`
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog> */}

        {/* DeletePost Dialog Box */}
        <DeletePostDialog element={element} open={this.props.ui.deleteOpen} onClose={this.props.closeDeleteDialog} auth={this.props.auth} deletePost={this.props.deletePost} history={this.props.history} />

        <EditPostDialog element={element} open={this.props.ui.editPostOpen} onClose={this.props.closeEditPostDialog} auth={this.props.auth} editPost={this.props.editPost} updateParent={this.updateElement} />
      </Fragment>
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
  closeMakeCommentDialog,
  closeMakePostDialog,
  openMakePostDialog,
  openDeleteDialog,
  closeDeleteDialog,
  openEditPostDialog,
  closeEditPostDialog,
  openSendMusicDialog,
  closeSendMusicDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post))
