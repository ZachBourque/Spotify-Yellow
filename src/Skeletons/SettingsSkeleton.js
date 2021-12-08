import {Fragment} from "react"
import AccountCircle from "@material-ui/icons/AccountCircle"
import EditIcon from "@material-ui/icons/Edit"
import Grid from "@material-ui/core/Grid"
import FavoriteCardSkeleton from "./FavoriteCardSkeleton"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import HighlightOffIcon from "@material-ui/icons/HighlightOff"

function SettingsSkeleton() {
  return (
    <Fragment>
      <h1>Settings</h1>
      <Grid container direction="row">
        <Grid item>
          <Avatar alt="cantfind" style={{width: 100, height: 100}}>
            <AccountCircle style={{width: 100, height: 100}} />
          </Avatar>
        </Grid>
        <Grid item>
          <IconButton className="button">
            <EditIcon color="primary" />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <h4 style={{marginRight: 5}}>Username:</h4>
        </Grid>
        <div style={{backgroundColor: "gray", height: 25, width: 177}} />
      </Grid>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <h4 style={{marginRight: 5}}>Bio:</h4>
        </Grid>
        <div style={{backgroundColor: "gray", height: 25, width: 177}} />
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="h4">Favourite Artists:</Typography>
        </Grid>
        <Grid item>
          {Array.from({length: 3}).map((e, idx) => {
            return (
              <Fragment key={idx}>
                <FavoriteCardSkeleton />
                <IconButton className="button">
                  <HighlightOffIcon />
                </IconButton>
              </Fragment>
            )
          })}
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="h4">Favourite Albums:</Typography>
        </Grid>
        <Grid item>
          {Array.from({length: 3}).map((e, idx) => {
            return (
              <Fragment key={idx}>
                <FavoriteCardSkeleton />
                <IconButton className="button">
                  <HighlightOffIcon />
                </IconButton>
              </Fragment>
            )
          })}
        </Grid>
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="h4">Favourite Songs:</Typography>
        </Grid>
        <Grid item>
          {Array.from({length: 3}).map((e, idx) => {
            return (
              <Fragment key={idx}>
                <FavoriteCardSkeleton />
                <IconButton className="button">
                  <HighlightOffIcon />
                </IconButton>
              </Fragment>
            )
          })}
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default SettingsSkeleton
