import tw, { styled, css } from "twin.macro";

export const Container = styled.div(() => [
  tw`container mx-auto pt-10 font-serif`
]);

export const LoaderWrapper = styled.div(() => [
  tw`container mx-auto flex flex-col items-center justify-center h-screen`
]);

export const Profile = styled.div(() => [
  tw`flex flex-col justify-center items-center`,

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
    }
  `
]);

export const PlaylistsWrapper = styled.div(() => [
  tw`
  mt-16 pt-4 pb-16
`,

  css`
    & {
      h2 {
        ${tw`text-2xl text-gray-200 text-center mb-5`}
      }

      .container {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        padding: 1.2em;
        gap: 4em 2em;

        @media (min-width: 768px) {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
