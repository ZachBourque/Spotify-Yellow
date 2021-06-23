import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Post from '../components/Post'
import {Grid} from '@material-ui/core';
import { getFeedData } from "../redux/actions/dataActions"


export class Homepage extends Component {

    state = {
        postList: null,
        isLoading: true,
    }

    componentDidMount() {
        if(!this.props.data.loaded || this.props.data.posts.length === 0){
            this.props.getFeedData()
        } else {
            this.setState({
                isLoading: false,
                postList: this.props.data.posts
            })
        }
    }

    componentDidUpdate(){
        if(this.state.isLoading && !this.props.data.loading){
            this.setState({
                postList: this.props.data.posts,
                isLoading: false
            })
        }
    }

    render() {
        return (
            <Grid
            container
            spacing={3}
            alignItems="center"
        >
                {
                !this.state.isLoading && this.state.postList?.map(post => {
                    return <Post element={post} history={this.props.history} key={post.postId}/>
                })}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data
})

const mapActionsToProps = {
    getFeedData
}

export default connect(mapStateToProps, mapActionsToProps)(Homepage)
