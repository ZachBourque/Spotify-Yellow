import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import $ from 'jquery';
import axios from 'axios'
import { useHistory } from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp( {userData} ) {
    const [selectedFile, setFile] = useState(userData.images[0])
    const classes = useStyles();
    const history = useHistory();


    const fileSelectedHandler = event => {
        var reader = new FileReader();
        var file = $('#fileinput').prop('files')[0];
        var url = URL.createObjectURL(file);
        setFile(url)

    }

    const fileUploadHander = (e) => {
        e.preventDefault()
        if(!$('#fileinput').prop('files')[0]){
            let image = "https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/images.png?alt=media&token=3e1714f4-9ccb-41dc-9e4a-da198e92dec7"
            axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createUser", {id: userData.id, username: $("#firstName").val(), profilepic: image})
            return
        }
        var image = $('#fileinput').prop('files')[0]
        const formData = new FormData()
        formData.append('image', image, image.name)
        axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/uploadpic", formData).then(res => {
            axios.post("http://localhost:5000/spotify-yellow-282e0/us-central1/api/createUser", {id: userData.id, username: $("#firstName").val(), profilepic: res.data.url}).then(res => {
                let sd = JSON.parse(window.localStorage.getItem("spotifyData"));
                sd.id = res.data.user.firebaseID
                window.localStorage.setItem("spotifyData", JSON.stringify(sd))
                history.push({
                    pathname:  "/profile"
                 });
                //window.history.push("/profile")
                window.location.reload()
            })
        })
        
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create your profile
        </Typography>

                <form className={classes.form}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid item xs={12} sm={12}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Username"
                                autoFocus
                                defaultValue={userData.display_name}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <label htmlFor="fileInput">Profile Picture:</label><br></br>
                            <input type="file" id="fileinput" onChange={fileSelectedHandler}/>
                            <img id="img-display" src={selectedFile} style={{height: '50%', width: '50%'}}></img>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={fileUploadHander}
                    >
                        Make Profile
          </Button>

                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}