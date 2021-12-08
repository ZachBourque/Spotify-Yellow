import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import {makeStyles} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const styles = makeStyles(theme => ({
  cardstyle: {
    display: "flex",
    width: 200,
    maxWidth: 200,
    margin: "auto",
    flexDirection: "column",
    height: 175
  },
  button: {
    maxWidth: 200,
    margin: 5
  }
}))

const FavoriteCardSkeleton = () => {
  let classes = styles()
  return (
    <Button className={classes.button}>
      <Card className={classes.cardstyle}>
        <div style={{backgroundColor: "gray", width: 110, height: 110, display: "block", marginLeft: "auto", marginRight: "auto"}} />
        <CardContent>
          <Typography variant="body1" align="center">
            <div style={{backgroundColor: "gray", width: 130, height: 20, marginLeft: "auto", marginRight: "auto"}} />
          </Typography>
        </CardContent>
      </Card>
    </Button>
  )
}

export default FavoriteCardSkeleton
