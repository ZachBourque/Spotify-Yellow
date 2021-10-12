import React from "react"
import Card from "@material-ui/core/Card"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import CardHeader from "@material-ui/core/CardHeader"
import {useHistory} from "react-router-dom"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  cardHeaderRoot: {
    overflow: "hidden"
  },
  cardHeaderContent: {
    overflow: "hidden"
  }
}))

function UserCard(props) {
  const styles = useStyles()
  let history = useHistory()
  let {user} = props
  return (
    <Card onClick={props.onClick ? props.onClick : () => history.push(`/profile=${user.id}`)} style={{cursor: "pointer", color: props.selected && "blue", height: 80}}>
      <CardHeader
        classes={{root: styles.cardHeaderRoot, content: styles.cardHeaderContent}}
        avatar={<Avatar src={user.profilepic} />}
        title={user.username}
        subheader={
          <Typography noWrap gutterBottom variant="body2">
            {user.bio}
          </Typography>
        }
      />
    </Card>
  )
}

export default UserCard
