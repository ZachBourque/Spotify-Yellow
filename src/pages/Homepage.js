import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Post from '../components/Post'
import {Grid} from '@material-ui/core';


export class Homepage extends Component {

    state = {
        postList: null,
        isLoading: true,
    }

    componentDidMount() {
        axios.get('http://localhost:5000/spotify-yellow-282e0/us-central1/api/allPosts').then(
            res => { this.setState({ postList: res.data, isLoading: false });}
        )
    }

    render() {
        return (
            <Grid
            container
            spacing={3}
            alignItems="center"
        >
                {
                !this.state.isLoading && this.state.postList?.map((element, index) => {
                    console.log(element)
                    return <Post element={element} key={index}/>
                    
                })}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage)
