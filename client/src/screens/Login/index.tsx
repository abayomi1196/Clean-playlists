import SpotifyIcon from "assets/spotify_icon.png";

import { Container } from "./styles";
const LOGIN_URI =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:8888"
    : "https://clean-playlists.herokuapp.com/";

function Login() {
  const loginHandler = async (): Promise<void> => {
    window.location.href = `${LOGIN_URI}/api/login`;
  };

  return (
    <Container>
      <div>
        <h1>Purify your philistine playlists.</h1>
        <p>
          Convert your explicit & savage playlists into clean ones in seconds.
        </p>

        <button onClick={loginHandler}>
          <span>login with spotify</span>
          <img src={SpotifyIcon} alt='Spotify icon' />
        </button>
      </div>
    </Container>
  );
}

export default Login;
