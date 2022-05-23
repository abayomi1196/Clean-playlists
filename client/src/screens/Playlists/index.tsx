import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Audio, ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";

import { Tokens, UserProfile, SingleUserPlaylist } from "utils/types";
import {
  getProfile,
  getPlaylists,
  setTokens,
  getProfileFollowing
} from "api/Spotify";

import SinglePlaylist from "components/SinglePlaylist";
import {
  Container,
  Profile,
  LoaderWrapper,
  PlaylistsWrapper,
  ConvertingWrapper
} from "./styles";

const getTokens = (): Tokens => {
  const cookieObj = document.cookie.split("; ").reduce((prev: any, current) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});

  const tokens: Tokens = cookieObj.authInfo
    ? JSON.parse(decodeURIComponent(cookieObj.authInfo))
    : null;

  return tokens;
};

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

    const tokens = getTokens();

    if (!tokens) {
      navigate("/");
      return;
    }

    setTokens(tokens);

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

  return (
    profile &&
    playlists && (
      <Container>
        <Profile>
          {profile.images && profile.images[0] && profile.images[0].url && (
            <img src={profile.images[0].url} alt={profile.display_name} />
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
        </Profile>

        <PlaylistsWrapper>
          <h2>Your Playlists</h2>

          <div className='container'>
            {playlists.map((playlist) => (
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
