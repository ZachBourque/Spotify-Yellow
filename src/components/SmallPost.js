import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Avatar, Grid, Paper, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Card } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import $ from 'jquery'
import Zero from '../assets/0.png'
import One from '../assets/1.png'
import Two from '../assets/2.png'
import Three from '../assets/3.png'
import Four from '../assets/4.png'
import Five from '../assets/5.png'
import Six from '../assets/6.png'
import Seven from '../assets/7.png'
import Eight from '../assets/8.png'
import Nine from '../assets/9.png'
import Ten from '../assets/10.png'
import withStyles from '@material-ui/core/styles/withStyles'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';

const styles = makeStyles(theme => ({

    header: {
        backgroundColor: '#FFBB35',
    }

}))

export class Post extends Component {

    state = {
        content: null,

    }

    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten];

    userRe = (id) => {
        this.props.history.push(`/profile=${id}`)
    }

    postRe = (id, comment) => {
        if (comment) {
            this.props.history.push(`/post/${id}#comment`)
        }else {
            this.props.history.push(`/post/${id}`)
        }
        
    }

    handleLike = () => {
        //TODO send post like to database
    }


    render() {
        const { classes, element, postId } = this.props
        return (
            
            <Card style={{ backgroundColor: "#4d4d4d" }} align="center">
                <CardHeader
                    avatar={
                        <Avatar src={element.pfp} style={{ cursor: 'pointer' }} onClick={() => this.userRe(element.authorid)} />
                    }
                    title={
                        <Typography variant="body1" style={{ cursor: 'pointer', width: 'fit-content' }} onClick={() => this.userRe(element.authorid)}>
                            {element.username}
                        </Typography>
                    }
                    style={
                        { backgroundColor: "#D99E2A" }
                    }
                />
                {/* Main Content */console.log(element)}
                <CardContent>
                    <div onClick={() => this.postRe(element.postId)} style={{cursor: 'pointer'}}>

                        <Grid container alignItems="center" justify="flex-start" direction="row">
                            {/* Left Half */}
                            <Grid item md={2}>
                                <CardMedia id="theImage" image={element.pic} component="img" />
                            </Grid>
                            {element.rating > -1 &&
                                <Grid item md={2}>
                                    <CardMedia image={this.imagesArray[element.rating]} component="img" />
                                </Grid>
                            }
                            <Grid item md={2}>
                                <Grid container direction="column" justify="space-between" alignItems="center">
                                    <Grid item>
                                        <Typography variant="body1">{element.artist.map?.((e, i) => {
                                            return <>{e}{i == element.artist.length - 1 ? '' : ', '}</>
                                        }) || element.artist}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">{element.album}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">{element.track}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Right Half */}
                            <Grid md={6} item alignContent="center" justify="space-around" direction="column" style={{ backgroundColor: '#2f2f2f', borderRadius: '5%' }}>
                                <Grid item>
                                    <Typography variant="h5" style={{ maxWidth: '75%' }}>{element.title}</Typography>
                                </Grid>
                                <Grid item>
                                    {element.body.split("\n").map(line => { return <Typography align="center" style={{ maxWidth: '75%' }}>{line}</Typography> })}
                                </Grid>
                            </Grid>


                        </Grid>
                    </div>
                    <Divider style={{ margin: 10 }} />
                    <CardActions disableSpacing>
                        <IconButton onClick={this.handleLike()}>
                            <ThumbUpIcon />
                        </IconButton>
                        <IconButton onClick={() => this.postRe(element.postId)}>
                            <CommentIcon />
                        </IconButton>
                        <IconButton >
                            <ShareIcon />
                        </IconButton>

                    </CardActions>

                </CardContent>


            </Card>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post))
