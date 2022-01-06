import React, {Component} from "react"
import {connect} from "react-redux"
import {Avatar, Card, CardContent, CardHeader, IconButton, Typography, Grid, CardActions, Menu, MenuItem} from "@material-ui/core/"
import {MoreVert, Create, Delete} from "@material-ui/icons/"
import {openDeleteDialog} from "../redux/actions/UIActions"
import AccountCircle from "@material-ui/icons/AccountCircle"


const CommentSkeleton = () => {
  return <Card>
  <CardHeader
    avatar={<Avatar>
      <AccountCircle />
    </Avatar>
    }
    title={
      <div style={{ backgroundColor: "gray", width: 200, height: 15, marginBottom: 5 }} />

    }
    style={{backgroundColor: "#A88F5D"}}
  />
  <CardContent>
    <Grid container alignItems="left" justify="flex-start" direction="row">
      <Grid item>
      <div style={{ backgroundColor: "gray", width: 600, height: 15, marginBottom: 5 }} />

      </Grid>
    </Grid>
  </CardContent>
  <CardActions>
  <div style={{ backgroundColor: "gray", width: 125, height: 15, marginBottom: 5 }} />

  </CardActions>
</Card>
}

export default CommentSkeleton
