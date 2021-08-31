import Card from "@material-ui/core/Card"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Comment from "@material-ui/icons/Comment"
import ThumbUp from "@material-ui/icons/ThumbUp"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: 345,
    height: 50
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  image: {
    width: 50
  },
  header: {
    maxHeight: 10
  }
}))

function Notification(props) {
  const classes = useStyles()
  let {notification} = props

  return (
    <Card className={classes.root} onClick={() => window.open(notification.type !== "send" ? `/post/${notification.postId}` : notification.postId, "_blank", "noopener,noreferrer")}>
      {notification.type == "send" ? <CardMedia image={notification.pic} component="img" className={classes.image} /> : notification.type == "like" ? <ThumbUp /> : <Comment />}
      <CardContent>
        <Typography variant="body1">{`${notification.senderName} ${notification.type == "like" ? "liked your post!" : notification.type == "comment" ? "commented on your post." : "sent you music."}`}</Typography>
      </CardContent>
    </Card>
  )
}

export default Notification
