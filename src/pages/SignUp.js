import React from "react"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import TextField from "@material-ui/core/TextField"
import Link from "@material-ui/core/Link"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import $ from "jquery"
import {connect} from "react-redux"
import {signUpUser} from "../redux/actions/authActions"
import withStyles from "@material-ui/core/styles/withStyles"
import Alert from "@material-ui/lab/Alert"

const styles = theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: "none"
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
})

class SignUp extends React.Component {
  state = {
    file: null,
    pfp: null,
    token: null,
    rtoken: null,
    expires: null,
    id: null
  }

  componentDidMount() {
    const {state} = this.props.location
    if (state && state.isAuthed) {
      this.setState({
        token: state.token,
        rtoken: state.rtoken,
        expires: state.expires,
        id: state.id
      })
    } else {
      this.props.history.push("/")
    }
  }

  fileSelectedHandler = event => {
    var file = $("#fileinput").prop("files")[0]
    if (file.type.includes("image")) {
      var url = URL.createObjectURL(file)
      this.setState({
        file: url,
        pfp: null
      })
    } else {
      this.setState({
        file: null
      })
    }
  }

  fileUploadHander = e => {
    e.preventDefault()

    let signUpData = {
      id: this.state.id,
      username: $("#firstName").val(),
      expires: this.state.expires,
      token: this.state.token,
      rtoken: this.state.rtoken
    }

    if (!$("#fileinput").prop("files")[0]) {
      signUpData.pfp = "https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/images.png?alt=media&token=3e1714f4-9ccb-41dc-9e4a-da198e92dec7"
    } else {
      var image = $("#fileinput").prop("files")[0]
      const formData = new FormData()
      formData.append("image", image, image.name)
      signUpData.formData = formData
    }
    this.props.signUpUser(signUpData, this.props.history)
  }
  render() {
    const {classes} = this.props
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
                <TextField autoComplete="fname" name="firstName" variant="outlined" required fullWidth id="firstName" label="Username" autoFocus />
              </Grid>

              <Grid item xs={12} sm={12}>
                <label htmlFor="fileInput">Profile Picture:</label>
                <br></br>
                <input type="file" id="fileinput" onChange={this.fileSelectedHandler} />
                <img id="img-display" src={this.state.file ? this.state.file : "https://firebasestorage.googleapis.com/v0/b/spotify-yellow-282e0.appspot.com/o/images.png?alt=media&token=3e1714f4-9ccb-41dc-9e4a-da198e92dec7"} style={{height: "50%", width: "50%"}}></img>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={this.fileUploadHander}>
              Make Profile
            </Button>
          </form>
          {this.props.ui.errors.signup && <Alert severity="error">{this.props.ui.errors.signup}</Alert>}
        </div>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui
})

const mapActionsToProps = {
  signUpUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(SignUp))
