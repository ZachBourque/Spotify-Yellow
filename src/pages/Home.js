import React from 'react'
import { useState } from 'react';
import Spotify from 'spotify-web-api-js';
import ButtonAppBar from '../components/ButtonAppBar';
import { Container, Paper } from '@material-ui/core';
import axios from 'axios'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"


class Home extends React.Component {



  render() {
    return (
      <div>
          <ButtonAppBar loggedIn={this.props.token} userData={this.props.userData} history={this.props.history} />
          <Container>

          </Container>
      </div>
    );
  }

}

export default Home;

