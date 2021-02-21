import { get } from 'jquery';
import { useState } from 'react';
import Spotify from 'spotify-web-api-js';
import ButtonAppBar from './components/ButtonAppBar';
import Container from '@material-ui/core/Container';
import axios from 'axios'

function App() {

  const [clientID, setClientID] = useState('e5f1276d07b74135956c8b3130f79f3f');
  const [clientSecret, setClientSecret] = useState('f8f6ea91d03149f1946b76cf391d21bf');
  const a = getHashParams();
  const [accessToken, setAccessToken] = useState(a.access_token);
  const [refreshToken, setRefreshToken] = useState(a.refresh_token);
  var s = new Spotify();
  s.setAccessToken(accessToken)

  const clicked = () => {
    var prev = s.searchTracks('Kanye', { limit: 5 });
    prev.then(
      function (data) {
        // clean the promise so it doesn't call abort
        prev = null;
        console.log(data)

        // ...render list of search results...
      },
      function (err) {
        console.error(err);
      }
    );
  }


  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  return (
    <div className="App">
      <ButtonAppBar />
      <Container>
        {
          !accessToken &&
          <a href="http://localhost:8888">
            <button >Go To Spotify</button>
          </a>
          
        }
        <button onClick={clicked}>log</button>
      </Container>

    </div>
  );
}

export default App;
