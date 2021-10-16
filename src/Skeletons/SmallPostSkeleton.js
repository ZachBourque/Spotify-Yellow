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

const useStyles = makeStyles(theme => ({
  icon: {
    width: 48,
    height: 48,
    justify: "center",
    alignItems: "center"
  },
  center: {
    margin: "auto"
  }
}))

const SmallPostSkeleton = () => {
  const classes = useStyles()
  return (
    <Card style={{backgroundColor: "#4d4d4d"}} align="center">
      <CardHeader
        avatar={
          <Avatar>
            <AccountCircle />
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={<div style={{backgroundColor: "gray", width: 200, height: 30}} />}
        style={{backgroundColor: "#D99E2A"}}
      />
      {/* Main Content */}
      <CardContent>
        <Grid container alignItems="center" justify="flex-start" direction="row">
          {/* Left Half */}
          <Grid item md={2}>
            <CardMedia>
              <div style={{backgroundColor: "gray", width: "98%", paddingTop: "100%"}} />
            </CardMedia>
          </Grid>
          <Grid item md={2}>
            <CardMedia>
              <div style={{backgroundColor: "gray", width: "98%", paddingTop: "100%"}} />
            </CardMedia>
          </Grid>
          <Grid item md={2}>
            <Grid container direction="column" justify="space-between" alignItems="center">
              <Grid item>
                <div style={{backgroundColor: "gray", width: 50, height: 15, marginBottom: 5}} />
                <div style={{backgroundColor: "gray", width: 100, height: 15}} />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Half */}
          <Grid md={6} item style={{backgroundColor: "#2f2f2f", borderRadius: "5%"}}>
            <Grid item>
              <div style={{backgroundColor: "gray", width: "50%", height: 30, marginBottom: 5, marginTop: 5}} />
            </Grid>
            <Grid item align="center">
              <div style={{backgroundColor: "gray", width: "80%", height: 25, marginBottom: 5}} />
            </Grid>
          </Grid>
        </Grid>
        <Divider style={{margin: 10}} />
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
      </CardContent>
    </Card>
  )
}

export default SmallPostSkeleton
