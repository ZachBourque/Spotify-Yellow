import React from 'react';
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CardHeader from '@material-ui/core/CardHeader'


function UserCard(props) {
	let { user } = props
	return (
		<Card onClick={() => props.history.push(`/profile=${user.id}`)} style={{width: props.width ? props.width : 325, cursor: "pointer"}}>
		<CardHeader
		avatar={
			<Avatar src={user.profilepic}/>
		}
		title={user.username}
		subheader={user.bio.length > (props.bioLength ? props.bioLength : 35) ? user.bio.substring(0,(props.bioLength ? props.bioLength : 35)) + "..." : user.bio}

		/>
		</Card>
	);
}

export default UserCard;