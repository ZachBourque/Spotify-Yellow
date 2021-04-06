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
        maxWidth: '300px',
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

const DisplayData = ({ element, id, onClick }) => {
    const classes = useStyles();
    return (
        
            <Paper syles={classes.paper} style={{ cursor: 'pointer' }} id={id} onClick={onClick}>
                <img
                    style={{
                        maxHeight: '150px',
                        maxWidth: '150px'
                    }}
                    src={element?.image ||
                        'https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg'
                    } id={id}>
                </img>
                {element?.artistName && <p style={{ margin: 0, padding: 0 }} id={id}> Artist: {element?.artistName}</p>}
                {element?.albumName && <p style={{ margin: 0, padding: 0 }} id={id}>Album: {element?.albumName}</p>}
                {element?.songName && <p style={{ margin: 0, padding: 0 }} id={id}>Song: {element?.songName}</p>}
                <h5></h5>
            </Paper>
    )
}

export default DisplayData
