import {Component, useState, useEffect, Fragment} from "react"
import {connect} from "react-redux"
import axios from "axios"
import SmallPost from "../components/SmallPost"
import SearchUsers from "../components/SearchUsersDialog"
import {Grid} from "@material-ui/core"
import {getFeedData} from "../redux/actions/dataActions"
import {IconButton} from "@material-ui/core"
import PostAddIcon from "@material-ui/icons/PostAdd"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import CloseIcon from "@material-ui/icons/Close"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import UserCard from "../components/UserCard"
import SendMusicDialog from "../components/SendMusicDialog"
import makeStyles from "@material-ui/core/styles/makeStyles"
import withStyles from "@material-ui/core/styles/withStyles"
import FeedSkeleton from "../Skeletons/FeedSkeleton"
import {openMakePostDialog, closeMakePostDialog} from "../redux/actions/UIActions"
import MakePostDialog from "../components/MakePostDialog"

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

  render() {
    const {classes} = this.props
    return (
      <Fragment>
        {this.props.ui.errors.feed ? (
          <Typography className={`${classes.message} ${classes.error}`} variant="h2">
            {this.props.ui.errors.feed}
          </Typography>
        ) : (
          <Fragment>
            <Grid container spacing={3} justify="center" align="center">
              <Grid item xs={12}>
                <Grid item xs={6}>
                  {this.props.data.loaded ? (
                    <Fragment>
                      <FeedSkeleton />
                      {this.props.data.posts.slice(0, this.state.numOfPosts).map((post, idx) => {
                        return <SmallPost element={post} history={this.props.history} key={post.postId} postId={post.postId} key={idx} />
                      })}
                    </Fragment>
                  ) : (
                    <FeedSkeleton />
                  )}
                </Grid>
              </Grid>
              {this.props.data.loaded && this.state.numOfPosts < 1000 && this.props.data.posts.length > this.state.numOfPosts && <Button onClick={() => this.setState({numOfPosts: this.state.numOfPosts + defaultNumOfPosts})}>Show more.</Button>}
            </Grid>
            <div className={classes.makePost}>
              <IconButton style={{width: "100%", height: "100%"}} onClick={() => this.props.openMakePostDialog({})}>
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
  ui: state.ui
})

const mapActionsToProps = {
  getFeedData,
  openMakePostDialog,
  closeMakePostDialog
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Homepage))
