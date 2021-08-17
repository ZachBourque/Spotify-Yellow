import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography, Grid, CardActions, Menu, MenuItem } from '@material-ui/core/'
import { MoreVert, Create, Delete } from '@material-ui/icons/'
import DeletePostDialog from './DeletePostDialog'

export class Comment extends Component {

    state = {

    }

    componentDidMount() {

    }

    userRe = (id) => {
        this.props.history.push(`/profile=${id}`)
    }

    handleClick = (event) => {
        this.setState({ menuOpen: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ menuOpen: null });
    };

    openDeletePost() {
        this.setState({ deletePostStatus: true })
    }

    closeDeletePost = () => {
        this.setState({ deletePostStatus: false })
    }

    render() {
        const { element } = this.props
        return (

            
            <Card>
                <CardHeader
                    avatar={<Avatar src={element.pfp}></Avatar>}
                    title={
                        <Typography variant="body1" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => this.userRe(element.authorid)}>
                            {element.username}
                        </Typography>
                    }
                    action={element.authorid == this.props.user.id &&
                        <>
                            <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                                <MoreVert />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={this.state.menuOpen}
                                keepMounted
                                open={Boolean(this.state.menuOpen)}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={() => { this.handleClose(); this.sharePost(); }}>Share</MenuItem>
                                {<MenuItem onClick={() => { this.handleClose(); this.openDeletePost(); }} style={{ color: 'red' }}><Delete />Delete Comment</MenuItem>}
                            </Menu>
                        </>
                    }
                    style={
                        { backgroundColor: "#A88F5D" }
                    }
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

                <DeletePostDialog
                    element={element}
                    open={this.state.deletePostStatus}
                    onClose={this.closeDeletePost}
                    auth={this.props.auth}
                    deletePost={this.props.deletePost}
                    history={this.props.history}
                    comment
                />

            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.auth
})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(Comment)
