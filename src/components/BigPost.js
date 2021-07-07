import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Avatar, Grid, Paper, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Card } from '@material-ui/core'
import clsx from 'clsx';
import { red } from '@material-ui/core/colors';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import axios from 'axios';

const styles = makeStyles(theme => ({

    header: {
        backgroundColor: '#FFBB35',
    }

}))

export class Post extends Component {

    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten];

    state = {
        content: null,
        element: null,
        isLoading: true,
        expanded: false,
    }

    
    userRe = (id) => {
        this.props.history.push(`/profile=${id}`)
    }

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded })
    }

    handleLike = () => {
        //TODO send post like to database
    }

    componentDidMount() {
        const id = this.props.match.params.postID
        axios.get(`/post/${id}`)
            .then(res => {
                this.setState({ element: res.data.post, isLoading: false })
                console.log(res.data.post)
            })
    }

    render() {
        const { classes, key } = this.props
        const { element } = this.state
        return (this.state.isLoading ? '' :
            <Grid container justify="center">
                <Grid item xs={6}>
                    <Card style={{ backgroundColor: "#4d4d4d" }} align="center">
                        <CardHeader
                            avatar={
                                <Avatar src={element.pfp} style={{ cursor: 'pointer' }} onClick={() => this.userRe(element.authorid)} />
                            }
                            title={
                                <Typography variant="h5">
                                    {element.username}
                                </Typography>
                            }
                            style={
                                { backgroundColor: "#D99E2A" }
                            }
                        />
                        {/* Items before divider */}
                        <CardContent>
                            <Grid container alignItems="flex-start" justify="space-between" direction="row">

                                <Grid item xs={4}>
                                    <a href={`https://open.spotify.com/${element.type}/${element.spotifyid}`}><CardMedia image={element.pic} component="img" style={{ maxWidth: "250px" }} /></a>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="h4" align="center" style={{ backgroundColor: '#002984', width: 'fit-content', borderRadius: '5%' }}>
                                        {element.artist.map?.((e, i) => {
                                            return <>{e}{i == element.artist.length - 1 ? '' : ', '}</>
                                        }) || element.artist}
                                    </Typography>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" align="center" style={{ backgroundColor: '#3f51b5', width: 'fit-content', borderRadius: '5%' }}>
                                            {element.album}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h4" align="center" style={{ backgroundColor: '#757de8', width: 'fit-content', borderRadius: '5%' }}>
                                            {element.track}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <CardMedia image={this.imagesArray[element.rating]} component="img" style={{ maxWidth: "150px" }} />
                                </Grid>
                            </Grid>

                            {/* Items After divider */}
                            <Grid container alignItems="center" justify="space-between" direction="row">
                                <Grid item xs={12}>
                                    <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h3" align="center">
                                        {element.title}
                                    </Typography>
                                </Grid>
                                <Box style={{ backgroundColor: "#363434", width: "80%", }} borderRadius={16}>
                                    <Grid item xs={12} >
                                        {element.body.split("\n").map(line => { return <Typography variant="body1" align="center">{line}</Typography> })}
                                    </Grid>
                                </Box>

                            </Grid>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <ThumbUpIcon onClick={this.handleLike()} />
                                </IconButton>
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: this.state.expanded,
                                    })}
                                    onClick={this.handleExpandClick}
                                    aria-expanded={this.state.expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </CardActions>
                        </CardContent>


                    </Card>
                </Grid>
            </Grid>)
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post))
