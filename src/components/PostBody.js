import { Component } from "react"
import { connect } from "react-redux"
import { Grid, Typography, Divider, CardContent, CardActions, IconButton } from "@material-ui/core"
import clsx from "clsx"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
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
import CommentIcon from "@material-ui/icons/Comment"
import { deletePost, editPost, setCurrentPost } from "../redux/actions/dataActions"
import { reloadUserProfile } from "../redux/actions/userActions"
import LikeButton from "./LikeButton"
import { openMakeCommentDialog, openMakePostDialog, openEditPostDialog, openDeleteDialog, openSendMusicDialog, openLoginDialog } from "../redux/actions/UIActions"

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

  checkOpenComment = () => {
    if (this.props.auth.loggedIn) {
      this.props.openMakeCommentDialog({ ...this.props.data.posts[0] })
    } else {
      this.props.openLoginDialog()
    }
  }

  sharePost() {
    //TODO
  }

  render() {
    const { classes } = this.props
    const element = this.props.data.posts[0]
    return (
      <CardContent>
        <Grid container justify="center" direction="row" alignItems="center">

          <Grid item>
            <Typography variant="h3" align="center">
              {element.title}
            </Typography>
            </Grid>

          <Grid item xs={12} >
            <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
            {!this.state.isLoading &&
              element.body.split("\n").map(line => {
                return (
                  <Typography variant="h5" align="center">
                    {line}
                  </Typography>
                )
              })}
          </Grid>
        </Grid>
        <CardActions disableSpacing>
          <LikeButton postId={element.postId} />
          {element.likeCount}
          <IconButton onClick={this.checkOpenComment}>
            <CommentIcon />
          </IconButton>
        </CardActions>
      </CardContent>

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
