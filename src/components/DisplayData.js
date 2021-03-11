import { Container, Avatar, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        textAlign: 'center',
        maxWidth: '300px !important',
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

const DisplayData = ({element, index}) => {
    const classes = useStyles();
    return (
        <Paper syles={classes.paper}>
        <img 
        style={{ 
            maxHeight: '150px', 
            maxWidth: '150px' 
        }} 
        src={element?.image || 
        'https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg'
        }>
        </img>
        <p style={{margin: 0, padding: 0}}>{element.artistName}</p>
        <p style={{margin: 0, padding: 0}}>{element.albumName}</p>
        <p style={{margin: 0, padding: 0}}>{element.songName}</p>
        <h5></h5>
        </Paper>
    )
}

export default DisplayData
