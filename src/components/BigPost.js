import { Component } from "react"
import { connect } from "react-redux"
import { Grid, Card, } from "@material-ui/core"
import withStyles from "@material-ui/core/styles/withStyles"
import { setCurrentPost } from "../redux/actions/dataActions"
import { reloadUserProfile } from "../redux/actions/userActions"
import { openMakeCommentDialog, openMakePostDialog, openEditPostDialog, openDeleteDialog, openSendMusicDialog, openLoginDialog } from "../redux/actions/UIActions"
import BigPostSkeleton from "../Skeletons/BigPostSkeleton"
import PostHeader from "../components/PostHeader"
import PostBody from "../components/PostBody"
import CommentList from "../components/CommentList"

const styles = theme => ({
  header: {
    backgroundColor: "#FFBB35"
  }
})

export class Post extends Component {

  state = {
    isLoading: true,
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

  render() {
    const { classes } = this.props
    const element = this.props.data.posts[0]
    return this.state.error ? (
      <h2 style={{ textAlign: "center" }}>{this.state.error}</h2>
    ) : this.state.isLoading ? (
      <BigPostSkeleton />
    ) : (
      <Grid container justify="center">
        <Grid item xs={10}>
        <Card align="center">
          <PostHeader {...this.props} />
          <PostBody {...this.props} />
        </Card>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={6}>
            <CommentList comments={this.props.data.posts[0].comments} history={this.props.history} />
          </Grid>
        
        </Grid>
      </Grid>

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
  setCurrentPost,
  openMakeCommentDialog,
  openMakePostDialog,
  openDeleteDialog,
  openEditPostDialog,
  openSendMusicDialog,
  openLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, { withTheme: true })(Post))
