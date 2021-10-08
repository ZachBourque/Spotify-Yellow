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
import {Fragment} from "react"

function FeedSkeleton(props) {
  return (
    <Fragment>
      {Array.from({length: 5}).map((element, idx) => {
        return (
          <Card style={{backgroundColor: "#4d4d4d"}} align="center">
            <CardHeader avatar={<AccountCircle />} action={<MoreVert />} title={<div style={{backgroundColor: "gray", width: 100, height: 30}} />} style={{backgroundColor: "#D99E2A"}} />

            {/* Main Content */}
            <CardContent>
              <Grid container alignItems="center" justify="flex-start" direction="row">
                {/* Left Half */}
                <Grid item md={2}>
                  <CardMedia>
                    <div style={{backgroundColor: "gray", width: 100, height: 100}} />
                  </CardMedia>
                </Grid>
                <Grid item md={2}>
                  <Grid container direction="column" justify="space-between" alignItems="center">
                    <Grid item>
                      <div style={{backgroundColor: "gray", width: 50, height: 15}} />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Half */}
                <Grid md={6} item alignContent="center" justify="space-around" direction="column" style={{backgroundColor: "#2f2f2f", borderRadius: "5%"}}>
                  <Grid item>
                    <div style={{backgroundColor: "gray", width: "50%", height: 30}} />
                  </Grid>
                  <Grid item align="center">
                    <div style={{backgroundColor: "gray", width: "80%", height: 15}} />
                    <div style={{backgroundColor: "gray", width: "80%", height: 15}} />
                  </Grid>
                </Grid>
              </Grid>
              <Divider style={{margin: 10}} />
              <CardActions disableSpacing>
                <ThumbUpOutline />
                <Comment />
                <Share />
              </CardActions>
            </CardContent>
          </Card>
        )
      })}
    </Fragment>
  )
}

export default FeedSkeleton
