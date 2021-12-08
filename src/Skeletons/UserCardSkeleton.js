import Card from "@material-ui/core/Card"
import Avatar from "@material-ui/core/Avatar"
import CardHeader from "@material-ui/core/CardHeader"
import AccountCircle from "@material-ui/icons/AccountCircle"

function UserCardSkeleton(props) {
  return (
    <Card style={{height: 80}}>
      <CardHeader
        avatar={
          <Avatar>
            <AccountCircle />
          </Avatar>
        }
        title={<div style={{backgroundColor: "gray", width: "60%", height: 17}} />}
        subheader={<div style={{backgroundColor: "gray", height: 15, marginTop: 5, marginBottom: 5, marginRight: 5}} />}
      />
    </Card>
  )
}

export default UserCardSkeleton
