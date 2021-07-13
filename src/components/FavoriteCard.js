import React from 'react';
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = makeStyles( theme => ({
	cardstyle: {
		width: 200,
		maxWidth: 200,
		margin: 'auto',
		flexDirection: 'column',
	},
	button: {
		maxWidth: 200
	}
}))

function FavoriteCard(props) {
	let classes = styles()
	return (
		<Button href={props.url} target="_blank" style={{ margin: 5, maxWidth: 200 }} className={classes.button}>
		<Card className={classes.cardstyle}>
			<img src={props.pic} width="110" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} />
			<CardContent>
			<Typography variant="body1" style={{textAlign: "center"}}>
				{props.name}
			</Typography>
			</CardContent>
		</Card>
		</Button>
	);
}

export default FavoriteCard;