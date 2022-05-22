import tw, { css, styled } from "twin.macro";

export const Wrapper = styled.div(() => [
  tw`bg-gray-600 bg-opacity-10  p-4 rounded-md shadow-2xl`,

  css`
    & {
      ${tw`text-left flex flex-col`}

      img {
        height: auto;
        object-fit: cover;
        ${tw`shadow-md w-full rounded-full cursor-pointer transition-all 
        hover:(shadow-lg opacity-70)`}
      }

      h4 {
        ${tw`text-gray-100 mt-4 transition-all font-light text-base
          hover:(text-white underline)
        `}
      }

      p {
        ${tw`text-gray-400 text-xs uppercase font-light mb-6`}
      }

      button {
        ${tw`bg-green-700 py-1.5 px-5 text-gray-100 rounded-sm mt-auto  transition-all
        hover:(bg-green-600 text-gray-200)
        `}
      }
    }
  `
]);
