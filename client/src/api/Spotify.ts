import axios, { AxiosResponse } from "axios";

import { delay } from "utils/helpers";
import {
  Tokens,
  UserProfile,
  UserPlaylists,
  SingleUserPlaylist,
  SingleTrack,
  PlaylistTracks
} from "utils/types";

// intercept errors to account for expired tokens
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 429) {
      console.log("error occurred");
      const retry_after = Number(error.response.headers["retry_after"]);

      if (retry_after) {
        await delay(retry_after);
        return axios.request(error.config);
      }
      console.log(error.response);
    } else if (error.response.status === 401) {
      console.log("Token probably expired");
    }
    return Promise.reject(error);
  }
);

// TOKENS ************************************************
let tokens: Tokens | null = {} as Tokens;

export const setTokens = (incomingTokens: Tokens) => {
  tokens = incomingTokens;
  window.localStorage.setItem("spotify_token_timestamp", String(Date.now()));
  window.localStorage.setItem("spotify_access_token", tokens.accessToken);
  window.localStorage.setItem("spotify_refresh_token", tokens.refreshToken);
};

const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

const setLocalAccessToken = (token: string) => {
  window.localStorage.setItem("spotify_token_timestamp", String(Date.now()));
  window.localStorage.setItem("spotify_access_token", token);
};

const setLocalRefreshToken = (token: string) => {
  window.localStorage.setItem("spotify_refresh_token", token);
};

const getTokenTimestamp = () =>
  window.localStorage.getItem("spotify_token_timestamp") as string;

const getLocalAccessToken = () =>
  window.localStorage.getItem("spotify_access_token");

const getLocalRefreshToken = () =>
  window.localStorage.getItem("spotify_refresh_token");

// Refresh the token
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${getLocalRefreshToken()}`
    );
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

// get and parse query params of document cookie into relevant tokens
export const getTokens = (): Tokens => {
  const cookieObj = document.cookie.split("; ").reduce((prev: any, current) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});

  const tokens: Tokens = cookieObj.authInfo
    ? JSON.parse(decodeURIComponent(cookieObj.authInfo))
    : null;

  // If token has expired
  if (
    getTokenTimestamp() &&
    Date.now() - +getTokenTimestamp() > EXPIRATION_TIME
  ) {
    console.log("refreshing here");
    refreshAccessToken();
  }

  const localAccessToken = getLocalAccessToken();

  // If there is no ACCESS token in local storage, set it and return `access_token` from params
  if (
    (!localAccessToken || localAccessToken === "undefined") &&
    tokens?.accessToken
  ) {
    setLocalAccessToken(tokens.accessToken);
    setLocalRefreshToken(tokens.refreshToken);
  }

  return tokens;
};

export const logout = () => {
  let delete_cookie = function (name: string) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  delete_cookie("authInfo");

  window.localStorage.removeItem("spotify_token_timestamp");
  window.localStorage.removeItem("spotify_access_token");
  window.localStorage.removeItem("spotify_refresh_token");

  window.location.href =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : "https://playlist-purify.herokuapp.com/";
};

// API CALLS **********************************************

const parsedTokens = getTokens();

const headers = {
  Authorization: `Bearer ${parsedTokens?.accessToken}`,
  "Content-Type": "application/json"
};

export const getProfile = async (): Promise<UserProfile> => {
  const res: AxiosResponse = await axios.get("https://api.spotify.com/v1/me/", {
    headers
  });
  return res.data;
};

export const getProfileFollowing = async (): Promise<{
  artists: { total: number };
}> => {
  const res: AxiosResponse = await axios.get(
    "https://api.spotify.com/v1/me/following?type=artist",
    {
      headers
    }
  );
  return res.data;
};

export const getPlaylists = async () => {
  let playlists: SingleUserPlaylist[] = [];

  try {
    const res: AxiosResponse = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers
      }
    );

    const playlistsData: UserPlaylists = res.data;
    playlists = playlists.concat(playlistsData.items);

    // next calls
    let calls = Math.ceil(playlistsData.total / playlistsData.limit);
    let next_url = res.data.next;

    while (calls > 1) {
      try {
        const res: AxiosResponse = await axios.get(next_url, {
          headers
        });

        const playlistData = res.data;
        next_url = playlistData.next;
        playlists = playlists.concat(playlistData.items);
      } catch (err) {
        console.log(err, "error while fetching more playlists");
        throw new Error("Error while fetching playlists");
      }

      calls--;
    }
  } catch (err) {
    console.log("error fetching playlists");
    throw new Error("Error while fetching playlists");
  }

  return playlists;
};

export const getPlaylistTracks = async (url: string) => {
  let totalSongs: SingleTrack[] = [];

  try {
    const response: AxiosResponse = await axios.get(url, {
      headers
    });

    const playlistData: PlaylistTracks = response.data;
    totalSongs = totalSongs.concat(playlistData.tracks.items);

    let calls = Math.ceil(
      playlistData.tracks.total / playlistData.tracks.limit
    );
    if (calls > 1) {
      let next_url = playlistData.tracks.next;

      while (calls > 1) {
        if (next_url) {
          let response: AxiosResponse = await axios.get(next_url, {
            headers
          });

          let moreSongs = response.data;
          totalSongs = totalSongs.concat(moreSongs.items);

          next_url = moreSongs.next;
          calls--;
        }
      }
    }
  } catch (err) {
    console.log("Unable to fetch playlist songs");
    throw new Error("Error while fetching playlists songs");
  }
  return totalSongs.filter((track) => !track.is_local);
};

export const findCleanSongs = async (tracks: SingleTrack[]) => {
  const cleanSongs: { id: string; name: string; artist: string }[] = [];

  for (const track of tracks) {
    if (track.track.explicit) {
      try {
        const res: AxiosResponse = await axios.get(
          `https://api.spotify.com/v1/search?q=${track.track.artists[0].name} ${track.track.name}&type=track`,
          {
            headers
          }
        );

        const searchResults = res.data;

        searchResults.tracks.items.some((trackObj: any) => {
          if (
            !trackObj.explicit &&
            trackObj.artists.some(
              (artist: any) => artist.name === track.track.artists[0].name
            )
          ) {
            cleanSongs.push({
              id: trackObj.id,
              name: trackObj.name,
              artist: trackObj.artists[0].name
            });
            return true;
          }
          return false;
        });
      } catch (err) {
        console.log(err, "Error occurred searching for songs");
      }
    } else {
      cleanSongs.push({
        id: track.track.id,
        name: track.track.name,
        artist: track.track.artists[0].name
      });
    }
  }

  return cleanSongs;
};

export const createNewPlaylist = async (prevName: string, userId: string) => {
  const response = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: `${prevName} (clean)`,
      public: true,
      description: "Purified using SpotifyPurify"
    },
    {
      headers
    }
  );

  const newPlayListData: { id: string } = response.data;

  return newPlayListData;
};

export const addCleanSongsToPlaylist = async ({
  cleanSongs,
  newPlaylistId
}: {
  cleanSongs: {
    id: string;
    name: string;
    artist: string;
  }[];
  newPlaylistId: string;
}) => {
  const totalSongList = Math.ceil(cleanSongs.length / 100);

  const uriArrays: Array<{ id: string }>[] = [];
  for (let i = 0; i < totalSongList; i++) {
    uriArrays[i] = cleanSongs.slice(i * 100, (i + 1) * 100).map((song) => {
      return { id: song.id };
    });
  }

  let promisesUri = [];
  for (const uri of uriArrays) {
    promisesUri.push(
      axios.post(
        `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
        {
          uris: uri.map((track) => `spotify:track:${track.id}`)
        },
        {
          headers
        }
      )
    );
  }
  const res = await axios.all(promisesUri);
  return res;
};
