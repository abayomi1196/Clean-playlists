import axios, { AxiosResponse } from "axios";

import { delay } from "../utils/helpers";
import {
  Tokens,
  UserProfile,
  UserPlaylists,
  SingleUserPlaylist,
  SingleTrack,
  PlaylistTracks
} from "../utils/types";

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

let tokens: Tokens | null = null;

export const setTokens = (incomingTokens: Tokens) => {
  tokens = incomingTokens;
};

export const getProfile = async (): Promise<UserProfile> => {
  const res: AxiosResponse = await axios.get("https://api.spotify.com/v1/me/", {
    headers: {
      Authorization: `Bearer ${tokens?.accessToken}`
    }
  });
  return res.data;
};

export const getProfileFollowing = async (): Promise<{
  artists: { total: number };
}> => {
  const res: AxiosResponse = await axios.get(
    "https://api.spotify.com/v1/me/following?type=artist",
    {
      headers: {
        Authorization: `Bearer ${tokens?.accessToken}`
      }
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
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`
        }
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
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`
          }
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
      headers: {
        Authorization: `Bearer ${tokens?.accessToken}`
      }
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
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`
            }
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
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`
            }
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
      headers: {
        Authorization: `Bearer ${tokens?.accessToken}`
      }
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
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`
          }
        }
      )
    );
  }
  const res = await axios.all(promisesUri);
  return res;
};
