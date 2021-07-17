import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Avatar, Card, CardContent, CardHeader, IconButton, Typography, Grid, CardActions } from '@material-ui/core/'
import MoreVertIcon from '@material-ui/icons/MoreVert'

export class Comment extends Component {

    state = {

    }

    componentDidMount() {

    }

    userRe = (id) => {
        this.props.history.push(`/profile=${id}`)
    }

    render() {
        const {element} = this.props
        return (
            <Card>
                <CardHeader
                avatar={<Avatar src={element.pfp}></Avatar>}
                    title={
                        <Typography variant="body1" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => this.userRe(element.authorId)}>
                            {element.username}
                        </Typography>
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
