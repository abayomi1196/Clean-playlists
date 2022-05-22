import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { SingleUserPlaylist } from "utils/types";
import { delay } from "utils/helpers";
import {
  getPlaylistTracks,
  findCleanSongs,
  createNewPlaylist,
  addCleanSongsToPlaylist,
  getPlaylists
} from "api/Spotify";
import { Wrapper } from "./styles";

function SinglePlaylist({
  playlist,
  userId,
  setPlaylist,
  setIsConverting,
  setProgressBarText
}: {
  playlist: SingleUserPlaylist;
  userId: string;
  setPlaylist: (playlists: SingleUserPlaylist[]) => void;
  setIsConverting: (val: boolean) => void;
  setProgressBarText: (val: string) => void;
}) {
  const navigate = useNavigate();

  async function handleConvertPlaylist(href: string) {
    try {
      setIsConverting(true);

      setProgressBarText("Fetching all songs in playlist...");

      const playlistTracks = await getPlaylistTracks(href);

      const cleanVariants = await findCleanSongs(playlistTracks);

      setProgressBarText("Finding clean versions... (might take a while.)");

      const newPlaylist = await createNewPlaylist(playlist.name, userId);

      setProgressBarText("Creating a new playlist...");

      await addCleanSongsToPlaylist({
        cleanSongs: cleanVariants,
        newPlaylistId: newPlaylist.id
      });

      setProgressBarText("Adding clean songs to playlist...");

      const playlists = await getPlaylists();
      setPlaylist(playlists);

      setProgressBarText("Done...");
      await delay(2);
    } catch (err) {
      Swal.fire({
        title: "Something went wrong!",
        icon: "warning",
        confirmButtonText: "Please try again"
      }).then(() => {
        navigate("/");
      });
      console.log(err);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <Wrapper>
      <a href={playlist.external_urls.spotify} target='_blank' rel='noreferrer'>
        <img src={playlist.images[0].url} alt={playlist.name} />
      </a>

      <h4>
        <a
          href={playlist.external_urls.spotify}
          target='_blank'
          rel='noreferrer'
        >
          {playlist.name}
        </a>
      </h4>
      <p>{playlist.tracks.total} Tracks</p>

      <button onClick={() => handleConvertPlaylist(playlist.href)}>
        Purify
      </button>
    </Wrapper>
  );
}

export default SinglePlaylist;
