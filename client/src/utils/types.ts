export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expires_in: Number;
};

export type UserProfile = {
  id: string;
  country: string;
  display_name: string;
  email: string;
  followers: { total: number; href: string | null };
  external_urls: {
    spotify: string;
  };
  images: [
    {
      url: string;
    }
  ];
};

export type UserPlaylists = {
  href: string;
  items: SingleUserPlaylist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type SingleUserPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [{ url: string }];
  name: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
};

export type PlaylistTracks = {
  name: string;
  tracks: {
    href: string;
    items: SingleTrack[];
    next: string | null;
    previous: string | null;
    total: number;
    limit: number;
  };
};

export type SingleTrack = {
  is_local: boolean;
  track: {
    name: string;
    id: string;
    explicit: boolean;
    artists: {
      id: string;
      name: string;
    }[];
  };
};
