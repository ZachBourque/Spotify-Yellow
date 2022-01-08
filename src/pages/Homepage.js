import {Component, useState, useEffect, Fragment} from "react"
import {connect} from "react-redux"
import SmallPost from "../components/SmallPost"
import Grid from "@material-ui/core/Grid"
import {getFeedData} from "../redux/actions/dataActions"
import IconButton from "@material-ui/core/IconButton"
import PostAddIcon from "@material-ui/icons/PostAdd"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import withStyles from "@material-ui/core/styles/withStyles"
import SmallPostSkeleton from "../Skeletons/SmallPostSkeleton"
import {openMakePostDialog, closeMakePostDialog, openLoginDialog} from "../redux/actions/UIActions"
import Alert from "@material-ui/lab/Alert"

const defaultNumOfPosts = 25

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  message: {
    textAlign: "center",
    marginTop: 20
  },
  error: {
    color: "red"
  },
  makePost: {
    bottom: 20,
    right: 20,
    position: "fixed",
    backgroundColor: "#D99E2A",
    borderRadius: "50%"
  }
})

export class Homepage extends Component {
  state = {
    numOfPosts: defaultNumOfPosts,
    isLoading: true,
    searchUsersState: false
  }

  componentDidMount() {
    this.props.getFeedData()
  }

  openSearchUsers = () => {
    this.setState({searchUsersState: true})
  }

  closeSearchUsers = () => {
    this.setState({searchUsersState: false})
  }

  checkOpenMakePost = () => {
    if (this.props.auth.loggedIn) {
      this.props.openMakePostDialog({})
    } else {
      this.props.openLoginDialog()
    }
  }

  render() {
    const {classes} = this.props
    return (
      <Fragment>
        {this.props.ui.errors.feed ? (
          <Alert severity="error" style={{justifyContent: "center"}}>
            {this.props.ui.errors.feed}
          </Alert>
        ) : (
          <Fragment>
            <Grid container spacing={3} justify="center" align="center">
              <Grid item xs={12}>
                <Grid item xs={12} sm={8} md={6}>
                  {this.props.data.loaded ? (
                    <Fragment>
                      {this.props.data.posts.slice(0, this.state.numOfPosts).map((post, idx) => {
                        return <SmallPost element={post} history={this.props.history} key={post.postId} postId={post.postId} key={idx} />
                      })}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {Array.from({length: 5}).map((element, idx) => {
                        return <SmallPostSkeleton key={idx} />
                      })}
                    </Fragment>
                  )}
                </Grid>
              </Grid>
              {this.props.data.loaded && this.state.numOfPosts < 1000 && this.props.data.posts.length > this.state.numOfPosts && <Button onClick={() => this.setState({numOfPosts: this.state.numOfPosts + defaultNumOfPosts})}>Show more.</Button>}
            </Grid>
            <div className={classes.makePost}>
              <IconButton style={{width: "100%", height: "100%"}} onClick={this.checkOpenMakePost}>
                <PostAddIcon />
              </IconButton>
            </div>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  data: state.data,
  ui: state.ui,
  auth: state.auth
})

const mapActionsToProps = {
  getFeedData,
  openMakePostDialog,
  closeMakePostDialog,
  openLoginDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles, {withTheme: true})(Homepage))
