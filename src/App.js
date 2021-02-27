import React from 'react'
import { useState } from 'react';
import Spotify from 'spotify-web-api-js';
import ButtonAppBar from './components/ButtonAppBar';
import Profile from './components/Profile';
import { Container, Paper } from '@material-ui/core';
import axios from 'axios'
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"


class App extends React.Component {


  theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  render() {
    return (
      <ThemeProvider theme={this.theme}>
          <ButtonAppBar loggedIn={this.props.userData.token} />
          <Container>

          </Container>
      </ThemeProvider>
    );
  }

}

export default App;
