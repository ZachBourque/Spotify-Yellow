import {useState, useEffect, Fragment} from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import {makeStyles} from "@material-ui/core/styles"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "@material-ui/core/IconButton"
import MoreVert from "@material-ui/icons/MoreVert"
import {connect} from "react-redux"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}))

function DisplayDataSkeleton(props) {
  const classes = useStyles()
  const {maxWidth, ex, id} = props
  const media = <CardMedia src={"https://media.pitchfork.com/photos/5c7d4c1b4101df3df85c41e5/1:1/w_600/Dababy_BabyOnBaby.jpg"} component="img" />

  const content = (
    <Box sx={{display: "flex", flexDirection: "column"}}>
      <CardContent sx={{flex: "1 0 auto"}}>
        <div style={{display: "flex"}}>
          <div style={{display: "block", overflow: "hidden", alignContent: ex ? "left" : "center"}}>
            <div style={{width: 100, height: 22, backgroundColor: "gray", marginBottom: 10}} />
            <div style={{width: 125, height: 20, backgroundColor: "gray", marginBottom: 20}} />
            {id > 0 && (
              <Fragment>
                <div style={{width: 115, height: 22, backgroundColor: "gray", marginBottom: 10}} />
                <div style={{width: 300, height: 20, backgroundColor: "gray", marginBottom: 20}} />
              </Fragment>
            )}
            {id > 1 && (
              <Fragment>
                <div style={{width: 100, height: 22, backgroundColor: "gray", marginBottom: 10}} />
                <div style={{width: 300, height: 20, backgroundColor: "gray"}} />
              </Fragment>
            )}
          </div>
          <div className={classes.root} />
          {ex ? (
            <IconButton style={{height: 48}}>
              <MoreVert />
            </IconButton>
          ) : null}
        </div>
      </CardContent>
    </Box>
  )

  return (
    <Fragment>
      <Card sx={{display: "flex"}} style={{marginBottom: "10px", width: "100%"}}>
        <Grid container direction="row" justify="center" alignItems="center">
          {ex ? (
            <Grid item xs={4}>
              {media}
            </Grid>
          ) : (
            <Fragment>{media}</Fragment>
          )}
          {ex ? (
            <Grid item xs={8}>
              {content}
            </Grid>
          ) : (
            <div style={{width: maxWidth}}>{content}</div>
          )}
        </Grid>
      </Card>
    </Fragment>
  )
}

export default DisplayDataSkeleton
