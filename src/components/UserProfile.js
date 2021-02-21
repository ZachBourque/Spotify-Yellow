import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default class UserProfile extends Component {

    state = {
        picture = '',
        name = ''
    }

    render() {
        return (
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <img src={this.state.picture}></img>
                    </Grid>
                    <Grid item xs={6}>
                        <h2>{this.state.name}</h2>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}
