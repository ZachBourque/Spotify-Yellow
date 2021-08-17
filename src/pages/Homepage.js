import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import SmallPost from '../components/SmallPost'
import SearchUsers from '../components/SearchUsersDialog'
import { Grid } from '@material-ui/core';
import { getFeedData, reloadFeedData } from "../redux/actions/dataActions"
import { IconButton } from '@material-ui/core'
import PostAddIcon from '@material-ui/icons/PostAdd';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MakePost from '../components/MakePost';
import UserCard from "../components/UserCard"
import SendMusicDialog from '../components/SendMusicDialog';

export class Homepage extends Component {

    state = {
        postList: null,
        isLoading: true,
        open: false,
        searchUsersState: false,
    }

    componentDidMount() {
        if (!this.props.data.loaded) {
            this.props.getFeedData()
        } else {
            this.props.reloadFeedData()
        }
    }

    componentDidUpdate() {
        console.log(this.props.data.feed[0])
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    openSearchUsers = () => {
        this.setState({ searchUsersState: true })
    }

    closeSearchUsers = () => {
        this.setState({ searchUsersState: false })
    }

    render() {
        return (
            <>

                <Grid
                    container
                    spacing={3}
                    align="center"
                >

                    {
                        this.props.data.loaded && this.props.data.current.map(post => {
                            return (
                                <Grid item xs={12}>
                                    <Grid item xs={6}>
                                        <SmallPost element={post} history={this.props.history} key={post.postId} postId={post.postId} />
                                    </Grid>
                                </Grid>
                            )
                        })}
                </Grid>
                <div style={{ bottom: 20, right: 20, position: 'fixed', backgroundColor: "#D99E2A", borderRadius: '50%' }}>
                    <IconButton style={{ width: '100%', height: '100%' }} onClick={this.handleClickOpen} >
                        <PostAddIcon />
                    </IconButton>
                </div>
                <Button variant="contained" onClick={this.openSearchUsers} ></Button>
             <SendMusicDialog
                    open={this.state.searchUsersState}
                    onClose={this.closeSearchUsers}
                />
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open} maxWidth="md" fullWidth>

                    <DialogContent >
                        <Grid container justify="center">
                            <Grid item>
                            <MakePost />
                            </Grid>
                        </Grid>

                    </DialogContent>

                </Dialog>

            </>

        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionsToProps = {
    getFeedData,
    reloadFeedData
}

export default connect(mapStateToProps, mapActionsToProps)(Homepage)
