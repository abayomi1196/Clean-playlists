# Clean playlists

> A web app that purifies and cleanses your spotify playlists.

Built using [Spotify Web API](https://developer.spotify.com/documentation/web-api/), [Create React App](https://github.com/facebook/create-react-app), [Express](https://expressjs.com/), among others.

## Setup

1. [Register a Spotify App](https://developer.spotify.com/dashboard/applications) and add `http://localhost:8888/callback` as a REDIRECT URI in the app settings
2. Create an `.env` file in the root of the project based on `.env.example`
3. `npm install` && `npm run dev`
4. `cd client` && `npm install` && `npm run start`

## Deploying to Heroku

1. Create new heroku app

```bash
  heroku create app-name
```

2. Set Heroku environment variables

```bash
    heroku config:set CLIENT_ID=XXXXX
    heroku config:set CLIENT_SECRET=XXXXX
    heroku config:set REDIRECT_URI=https://app-name.herokuapp.com/callback
    heroku config:set FRONTEND_URI=https://app-name.herokuapp.com
```

3. Push to Heroku

```git
  git push heroku master
```

4. Add `http://app-name.herokuapp.com/callback` as a Redirect URI in the spotify application settings
