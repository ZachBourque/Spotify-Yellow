import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Avatar, Grid, Paper, Typography, Divider, Box, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Card } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx';
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

    render() {
        const { classes, element } = this.props
        return (

            <Card style={{ backgroundColor: "#4d4d4d" }}>
                <CardHeader
                    avatar={
                        <Avatar src={element.pfp} style={{cursor: 'pointer'}} onClick={() => this.userRe(element.authorid)} />
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
                <CardContent>
                    <Grid container justify="center">
                    <a href={`https://open.spotify.com/${element.type}/${element.spotifyid}`}><CardMedia image={element.pic} component="img" style={{ maxWidth: "200px" }} /></a>
                        <img src={this.imagesArray[element.rating]} style={{ width: 'auto', height: '10em', float: 'left', }} />
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center" style={{backgroundColor: '#002984', width: 'fit-content', borderRadius: '5%'}}>
                                {element.artist}
                            </Typography>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center" style={{backgroundColor: '#3f51b5', width: 'fit-content', borderRadius: '5%'}}>
                                    {element.album}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4" align="center" style={{backgroundColor: '#757de8', width: 'fit-content', borderRadius: '5%'}}>
                                    {element.track}
                                </Typography>
                            </Grid>
                        </Grid>
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
                </CardContent>


            </Card>
            /*<Container className={classes.postCard}>
                <Box border={1} borderRadius={16}>

                    <Grid container spacing={3}>
                        <Grid item xs>
                            <img src={element.pfp} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block', height: '5em', float: 'left', borderRadius: '50%' }}></img>
                            <Typography variant="h5" color="inherit">
                                {element.username}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="h2" align="center" color="textPrimary">
                                {element.title}
                            </Typography>
                        </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <img src={element.pic} style={{ maxHeight: '200px' }}></img>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                {element.artist}
                            </Typography>
                        </Grid>
                    </Grid>

                </Box>
            </Container>*/
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post))
