import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Audio, ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";

import { ReactComponent as NoUserIcon } from "assets/user_icon.svg";
import { UserProfile, SingleUserPlaylist } from "utils/types";
import {
  getProfile,
  getPlaylists,
  getProfileFollowing,
  logout
} from "api/Spotify";
import GitOcto from "components/GitOcto";
import SearchBar from "components/SearchBar";
import SinglePlaylist from "components/SinglePlaylist";
import {
  Container,
  Profile,
  LoaderWrapper,
  PlaylistsWrapper,
  ConvertingWrapper
} from "./styles";

function Playlists() {
  const navigate = useNavigate();

  const [isConverting, setIsConverting] = useState(false);
  const [progressBarText, setProgressBarText] = useState("");
  const [profile, setProfile] = useState<UserProfile>({} as UserProfile);
  const [followingCount, setFollowingCount] = useState(0);
  const [playlists, setPlaylists] = useState<SingleUserPlaylist[]>(
    [] as SingleUserPlaylist[]
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profile = await getProfile();
        setProfile(profile);

        const following = await getProfileFollowing();
        setFollowingCount(following.artists.total);

        const playlists = await getPlaylists();
        setPlaylists(playlists);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return (
      <LoaderWrapper>
        <Audio height='100' width='100' color='grey' ariaLabel='loading' />
      </LoaderWrapper>
    );
  }

  if (isError) {
    Swal.fire({
      title: "Error!",
      text: "An error occurred, please try again",
      icon: "error",
      confirmButtonText: "Back to login"
    }).then(() => {
      navigate("/");
    });
  }

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    profile &&
    playlists && (
      <Container>
        <GitOcto />
        <Profile>
          {profile.images && profile.images[0] && profile.images[0].url ? (
            <img src={profile.images[0].url} alt={profile.display_name} />
          ) : (
            <div className='no-user-wrapper'>
              <NoUserIcon />
            </div>
          )}
          {profile.external_urls && (
            <h1>
              <a
                href={profile.external_urls.spotify}
                target='_blank'
                rel='noreferrer'
              >
                {profile.display_name}
              </a>
            </h1>
          )}

          <div className='profile-stats'>
            {profile.followers && (
              <div>
                <h3>{profile.followers.total}</h3> <p>Followers</p>
              </div>
            )}
            <div>
              <h3>{followingCount}</h3>
              <p>Following</p>
            </div>

            <div>
              <h3>{playlists.length}</h3>
              <p>Playlists</p>
            </div>
          </div>

          <button onClick={() => logout()}>Logout</button>
        </Profile>

        <PlaylistsWrapper>
          <h2>Your Playlists</h2>
          <SearchBar value={searchTerm} onChange={handleSearchChange} />

          {filteredPlaylists.length ? (
            <div className='container'>
              {filteredPlaylists.map((playlist) => (
                <SinglePlaylist
                  playlist={playlist}
                  setIsConverting={setIsConverting}
                  setProgressBarText={setProgressBarText}
                  setPlaylist={setPlaylists}
                  userId={profile.id}
                  key={playlist.id}
                />
              ))}
            </div>
          ) : (
            <p className='no-playlists'>
              No playlist with name: <span>`{searchTerm}`</span>
            </p>
          )}
        </PlaylistsWrapper>

        {isConverting && (
          <ConvertingWrapper>
            <div>
              <h3>{progressBarText}</h3>
              <ThreeDots
                height='100'
                width='100'
                color='grey'
                ariaLabel='loading'
              />
            </div>
          </ConvertingWrapper>
        )}
      </Container>
    )
  );
}

export default Playlists;
