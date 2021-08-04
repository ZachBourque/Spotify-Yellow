import {useState, useEffect, Fragment} from 'react';
import Card from "@material-ui/core/Card"
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from '@material-ui/core/styles';

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
	return (
		<Card className={classes.root} onClick={() => window.open(notification.postId, "_blank", 'noopener,noreferrer')}>
		<CardHeader
		className={classes.header}
		disableTypography={true}
		title={<Typography variant="body">{`${notification.senderName} sent you music!`}</Typography>}
		>
		</CardHeader>	
		<CardContent className={classes.content}>
		<CardMedia image={notification.pic} component="img" className={classes.image}/>
		<Typography variant="body">
			Click here to check it out on spotify.
		</Typography>
		</CardContent>
		</Card>
	);
}

export default Notification;