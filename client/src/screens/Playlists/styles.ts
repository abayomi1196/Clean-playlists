import tw, { styled, css } from "twin.macro";

export const Container = styled.div(() => [
  tw` mx-auto pt-10 font-serif min-h-screen`,

  css`
    & {
      .spotify-logo {
        ${tw`
        w-11 object-cover absolute left-3.5 top-3.5 
        lg:(w-16 left-12 top-7)
        `}
      }
    }
  `
]);

export const LoaderWrapper = styled.div(() => [
  tw`container mx-auto flex flex-col items-center justify-center h-screen`
]);

export const Profile = styled.div(() => [
  tw`container flex flex-col justify-center items-center mx-auto mt-8 
  lg:(mt-0)`,

  css`
    & {
      .no-user-wrapper {
        ${tw`p-4 rounded-full border-2 border-white`}

        svg {
          fill: white;
          height: 86px;
          width: 86px;
        }
      }

      img {
        ${tw`w-40 object-fill rounded-full`}
      }

      h1 {
        ${tw`text-gray-200 text-5xl font-bold text-center mt-6 mb-3 transition-colors
        hover:(text-green-600)
        `}
      }

      .profile-stats {
        ${tw`flex space-x-8`}

        div {
          ${tw`flex flex-col space-x-2 items-center justify-center`}

          h3 {
            ${tw`text-green-800 text-2xl`}
          }

          p {
            ${tw`text-gray-300 font-bold uppercase text-xs`}
          }
        }
      }

      button {
        ${tw`text-white border-2 border-white mt-8 py-3 px-8 text-xs font-bold uppercase text-center
        hover:(bg-white bg-opacity-20 text-gray-300)
        focus:(text-gray-200 outline-none)
        active:(bg-gray-100 outline-none bg-opacity-30)
        focus-visible:(ring-offset-2 ring-gray-700 outline-none)
        `}
        border-radius: 30px;
        letter-spacing: 1px;
      }
    }
  `
]);

export const PlaylistsWrapper = styled.div(() => [
  tw`
  mt-16 pt-4 pb-16 text-center container mx-auto
`,

  css`
    & {
      h2 {
        ${tw`text-2xl text-gray-200 text-center mb-5 `}
      }

      .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        padding: 1.2em;
        gap: 4em 2em;

        @media (min-width: 768px) {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }

      p.no-playlists {
        ${tw`text-white text-center lg:(text-lg)`}

        span {
          ${tw`text-green-500 uppercase`}
        }
      }
    }
  `
]);

export const ConvertingWrapper = styled.div(() => [
  tw`w-full absolute h-full top-0 left-0 bg-gray-800 bg-opacity-80 mx-auto flex flex-col items-center justify-center`,

  css`
    & {
      > div {
        ${tw`fixed top-2/4 text-center text-gray-200 flex flex-col items-center justify-center`}

        h3 {
          ${tw`text-center text-2xl pb-1 lg:(text-3xl)`}
        }
      }
    }
  `
]);
