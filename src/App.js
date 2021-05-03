import React from 'react'
import { useState } from 'react';
import Spotify from 'spotify-web-api-js';
import ButtonAppBar from './components/ButtonAppBar';
import Profile from './pages/Profile';
import { Container, Paper } from '@material-ui/core';
import axios from 'axios'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"


class App extends React.Component {



  render() {
    return (
      <div>
          <ButtonAppBar loggedIn={this.props.token} userData={this.props.userData} />
          <Container>

          </Container>
      </div>
    );
  }

}

export default App;
