const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const expressSession = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const axios = require("axios");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:8888/callback";
let FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";
const PORT = process.env.PORT || 8888;

if (process.env.NODE_ENV !== "production") {
  REDIRECT_URI = "http://localhost:8888/callback";
  FRONTEND_URI = "http://localhost:3000";
}

// --- PASSPORT AUTH SETUP ---//

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
// https://www.passportjs.org/packages/passport-spotify/
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      //remember to add this to your developer dashboard redirect uri
      callbackURL: `${REDIRECT_URI}`
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      return done(null, profile, {
        accessToken,
        refreshToken,
        expires_in
      });
    }
  )
);

morgan.token("data", (req, res) => {
  if (req.method === "POST") {
    return [req.body];
  }

  if (req.method === "PUT") {
    return [req.body];
  }
});

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms :data"
);

const app = express();

// prioritize all static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(express.static(path.join(__dirname, "./client/public")));

app
  .use(express.static(path.join(__dirname, "./client/build")))
  .use(cors())
  .use(express.json())
  .use(cookieParser())
  .use(morganMiddleware)
  .use(passport.initialize())
  .use(express.static(path.join(__dirname, "./client/build")));

app.use(
  expressSession({
    secret: "This is one hell of a secret",
    resave: false,
    saveUninitialized: false
  })
);

app.get("/", function (req, res) {
  res.render(path.resolve(__dirname, "./client/build", "index.html"));
});

app.get(
  "/api/login",
  passport.authenticate("spotify", {
    display: "popup",
    scope: [
      "user-read-private",
      "user-follow-read",
      "playlist-modify-private",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-read-collaborative"
    ],
    showDialog: true
  }),
  function (req, res) {}
);

app.get(
  "/callback",
  passport.authenticate("spotify", {
    failureRedirect: REDIRECT_URI
  }),
  function (req, res) {
    const authInfo = JSON.stringify(res.req.authInfo);
    res.cookie("authInfo", authInfo);
    res.redirect(`${FRONTEND_URI}/playlists`);
  }
);

app.get("api/refresh_token", function (req, res) {
  // get access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token
    },
    json: true
  };

  axios.post(authOptions.url, null, authOptions).then((response) => {
    if (response.status === 200) {
      let access_token = response.data.access_token;
      res.send({
        access_token
      });
    }
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./client/public", "index.html"));
});

app.listen(PORT, function () {
  console.warn(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});
