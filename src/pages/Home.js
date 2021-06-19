import React from 'react'
import { useState } from 'react';
import Spotify from 'spotify-web-api-js';
import ButtonAppBar from '../components/ButtonAppBar';
import { Container, Paper } from '@material-ui/core';
import axios from 'axios'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import MakePost from "../components/MakePost"

class Home extends React.Component {



  render() {
    return (
      <div>
          <ButtonAppBar history={this.props.history}/>
      </div>
    );
  }

}

export default Home;

