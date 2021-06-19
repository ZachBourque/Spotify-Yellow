import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Avatar, Grid, Paper, Typography, Divider } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
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
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(theme => ({
    card: {
        display: 'flex',
        marginBottom: 20,
        margin: 'auto',
    },

}))

export class Post extends Component {

    state = {
        
    }

    imagesArray = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten];


    render() {
        const { classes } = this.props
        return (
            <Grid item xs={12} style={{padding: 0}}>
            <Grid item xs={6} style={{margin: 'auto'}}>
                <Card class={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar src={this.props.element.pfp || 'https://cdn.discordapp.com/attachments/705520938921361411/855531857114038332/ABU1Xn6_d.png'} alt={this.props.element.username} class={classes.avatar} />
                        }
                        title={this.props.element.username}
                        subheader={this.props.element.createdAt}
                    />
                    <Grid
                        container
                        spacing={3}
                        xs={12}
                    >
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={16}>
                                <img src={this.props.element.pic} style={{ maxHeight: 200 }} />
                            </Grid>
                            <Grid container justify="center" spacing={3}>
                                <Typography variant="h3" style={{ textShadow: '2px 2px #ff6961' }}>{this.props.element.artist}</Typography>
                            </Grid>
                            <Grid container justify="center" spacing={3}>
                                <Typography variant="h3" style={{ textShadow: '2px 2px #ffb347' }}>{this.props.element.album}</Typography>
                            </Grid>
                            <Grid container justify="center" spacing={3}>
                                <Typography variant="h3" style={{ textShadow: '2px 2px #fdfd96' }}>{this.props.element.song}</Typography>
                            </Grid>

                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={3}>
                                <img src={this.imagesArray[this.props.element.rating]} style={{ maxHeight: 100 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider style={{margin: '5vh'}} />
                    <Grid container justify="center" spacing={3}>
                                <Typography variant="body1">{this.props.element.body}</Typography>
                            </Grid>
                    </Card>
                    
            </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Post))
