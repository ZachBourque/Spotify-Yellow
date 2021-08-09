import Card from "@material-ui/core/Card"
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from '@material-ui/core/styles';
import { Comment, ThumbUp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    maxHeight: 100,
  },
  content: {
	display: "flex",
	alignItems: "center"
  },
  image: {
	width: 50,
	paddingRight: 10
  },
  header: {
	maxHeight: 10
  }


}));

function Notification(props) {
	const classes = useStyles()
	let {notification} = props
	console.log(notification)

	let header = <Typography variant="body">{`${notification.senderName} ${notification.type == "like" ? ("liked your post!") : notification.type=="comment" ? ("commented on your post!") : "sent you music!"}`}</Typography>

	return (
		<Card className={classes.root} onClick={() => window.open(`/post/${notification.postId}`, "_blank", 'noopener,noreferrer')}>
		<CardHeader
		className={classes.header}
		disableTypography={true}
		title={header}
		>
		</CardHeader>	
		<CardContent className={classes.content}>
		{notification.type == "send" ? <CardMedia image={notification.pic} component="img" className={classes.image}/> : notification.type == "like" ? <ThumbUp/> : <Comment/>}
		<Typography variant="body" style={{marginLeft: 20}}>
			{`Click here to check it out${notification.type == "send" ? (" on spotify!") : ("!")}`}
		</Typography>
		</CardContent>
		</Card>
	);
}

export default Notification;