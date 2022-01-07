import AccountCircle from "@material-ui/icons/AccountCircle"
import MoreVert from "@material-ui/icons/MoreVert"
import ThumbUpOutline from "@material-ui/icons/ThumbUpOutlined"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import CardActions from "@material-ui/core/CardActions"
import Comment from "@material-ui/icons/Comment"
import Share from "@material-ui/icons/Share"
import makeStyles from "@material-ui/core/styles/makeStyles"
import IconButton from "@material-ui/core/IconButton"
import Avatar from "@material-ui/core/Avatar"
import CommentSkeleton from "./CommentSkeleton"
import CommentIcon from "@material-ui/icons/Comment"
import ThumbUp from "@material-ui/icons/ThumbUp"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {Fragment} from "react"

const BigPostSkeleton = () => {
  return (
    <Fragment>
      <Card style={{backgroundColor: "#4d4d4d"}} align="center">
        <CardHeader
          avatar={
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </Grid>
              <Grid item>
                <div style={{backgroundColor: "gray", width: 200, height: 15, marginBottom: 5}} />
              </Grid>
            </Grid>
          }
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
        />
        {/* Main Content */}
        <CardContent>
          <Grid container alignItems="center" justify="space-between" direction="row">
            <Grid item xs={4}>
              <div style={{backgroundColor: "gray", width: 275, height: 275, marginBottom: 5}} />
            </Grid>
            <Grid item xs={4}>
              <div style={{backgroundColor: "gray", width: 350, height: 25, marginBottom: 5}} />
              <Grid item xs={12}>
                <div style={{backgroundColor: "gray", width: 350, height: 25, marginBottom: 5}} />
              </Grid>
              <Grid item xs={12}>
                <div style={{backgroundColor: "gray", width: 350, height: 25, marginBottom: 5}} />
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <div style={{backgroundColor: "gray", width: 200, height: 200, marginBottom: 5}} />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <IconButton>
            <ThumbUpOutline />
          </IconButton>
          <IconButton>
            <Comment />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </CardActions>

        <CardContent>
          <Grid container justify="center" direction="row" alignItems="center">
            <Grid item>
              <div style={{backgroundColor: "gray", width: 800, height: 50, marginBottom: 5}} />
            </Grid>

            <Grid item xs={12}>
              <Divider style={{marginTop: "10px", marginBottom: "10px"}} />
              <div style={{backgroundColor: "gray", width: 800, height: 50, marginBottom: 5}} />
            </Grid>
          </Grid>
          <CardActions disableSpacing>
            <ThumbUp />
            <IconButton>
              <CommentIcon />
            </IconButton>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
        </CardContent>
      </Card>
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={6}>
            {Array.from({length: 5}).map((e, i) => {
              return <CommentSkeleton key={i} />
            })}
          </Grid>
        </Grid>
        {/*comment skeletons*/}
      </div>
    </Fragment>
  )
}

export default BigPostSkeleton
