import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import SmallPost from '../components/SmallPost'
import { Grid } from '@material-ui/core';
import { getFeedData } from "../redux/actions/dataActions"


export class Homepage extends Component {

    state = {
        postList: null,
        isLoading: true,
    }

    componentDidMount() {
        if (!this.props.data.loaded || this.props.data.posts.length === 0) {
            this.props.getFeedData()
        } else {
            this.setState({
                isLoading: false,
                postList: this.props.data.posts
            })
        }
    }

    componentDidUpdate() {
        if (this.state.isLoading && !this.props.data.loading) {
            this.setState({
                postList: this.props.data.posts,
                isLoading: false
            })
        }
        console.log(this.state.postList)
    }

    render() {
        return (
            <Grid
                container
                spacing={3}
                align="center"
            >
                {
                    !this.state.isLoading && this.state.postList?.map(post => {
                        return (
                            <Grid item xs={12}>
                                <Grid item xs={6}>
                                    <SmallPost element={post} history={this.props.history} key={post.postId} postId={post.postId} />
                                </Grid>
                            </Grid>
                        )

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
