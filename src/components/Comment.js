import React, {Component} from "react"
import {connect} from "react-redux"
import Avatar from "@material-ui/core/Avatar" 
import Card from "@material-ui/core/Card" 
import CardContent from "@material-ui/core/CardContent" 
import CardHeader from "@material-ui/core/CardHeader" 
import IconButton from "@material-ui/core/IconButton" 
import Typography from "@material-ui/core/Typography" 
import Grid from "@material-ui/core/Grid" 
import CardActions from "@material-ui/core/CardActions" 
import Menu from "@material-ui/core/Menu" 
import MenuItem from "@material-ui/core/MenuItem" 
import MoreVert from "@material-ui/icons/MoreVert"
import Delete from "@material-ui/icons/Delete"
import {openDeleteDialog} from "../redux/actions/UIActions"

export class Comment extends Component {
  state = {}

  componentDidMount() {}

  userRe = id => {
    this.props.history.push(`/profile=${id}`)
  }

  handleClick = event => {
    this.setState({menuOpen: event.currentTarget})
  }

  handleClose = () => {
    this.setState({menuOpen: null})
  }

  render() {
    const {element} = this.props
    return (
      <Card>
        <CardHeader
          avatar={<Avatar src={element.pfp}></Avatar>}
          title={
            <Typography variant="body1" style={{cursor: "pointer", width: "fit-content"}} onClick={() => this.userRe(element.authorid)}>
              {element.username}
            </Typography>
          }
          action={
            element.authorid === this.props.user.id && (
              <>
                <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                  <MoreVert />
                </IconButton>
                <Menu id="simple-menu" anchorEl={this.state.menuOpen} keepMounted open={Boolean(this.state.menuOpen)} onClose={this.handleClose}>
                  <MenuItem
                    onClick={() => {
                      this.handleClose()
                      this.sharePost()
                    }}
                  >
                    Share
                  </MenuItem>
                  {
                    <MenuItem onClick={() => this.props.openDeleteDialog({...element, comment: true})} style={{color: "red"}}>
                      <Delete />
                      Delete Comment
                    </MenuItem>
                  }
                </Menu>
              </>
            )
          }
          style={{backgroundColor: "#A88F5D"}}
        />
        <CardContent>
          <Grid container alignItems="left" justify="flex-start" direction="row">
            <Grid item>
              <Typography variant="body1" color="initial">
                {element.body}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Typography variant="body2" color="initial">
            {element.createdAt}
          </Typography>
        </CardActions>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth
})

const mapActionsToProps = {
  openDeleteDialog
}

export default connect(mapStateToProps, mapActionsToProps)(Comment)
