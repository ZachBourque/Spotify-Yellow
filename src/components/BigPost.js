import {Component} from "react"
import {connect} from "react-redux"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import withStyles from "@material-ui/core/styles/withStyles"
import {setCurrentPost} from "../redux/actions/dataActions"
import {reloadUserProfile} from "../redux/actions/userActions"
import {openMakeCommentDialog, openMakePostDialog, openEditPostDialog, openDeleteDialog, openSendMusicDialog, openLoginDialog} from "../redux/actions/UIActions"
import BigPostSkeleton from "../Skeletons/BigPostSkeleton"
import PostHeader from "../components/PostHeader"
import PostBody from "../components/PostBody"
import CommentList from "../components/CommentList"
import Alert from "@material-ui/lab/Alert"

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
        this.setState({isLoading: false})
      })
      .catch(() => {
        this.setState({error: "Could not get post."})
      })
  }

  render() {
    const {classes} = this.props
    const element = this.props.data.posts[0]
    return this.state.error ? (
      <Alert severity="error" style={{textAlign: "center", justifyContent: "center"}}>
        {this.state.error}
      </Alert>
    ) : this.state.isLoading ? (
      <BigPostSkeleton />
    ) : (
      <Grid container justify="center">
        <Grid item xs={12} sm={10}>
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

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, {withTheme: true})(Post))
