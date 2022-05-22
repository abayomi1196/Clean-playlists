import tw, { styled, css } from "twin.macro";

export const Container = styled.div(() => [
  tw`container px-4 mx-auto h-screen flex flex-col items-center justify-center font-serif
  lg:(items-start)
  `,

  css`
    & > div {
      margin-top: -100px;
      ${tw`lg:(shadow-sm)`}
    }
    & h1 {
      ${tw`text-5xl font-bold text-gray-300 mb-4
        lg:(text-7xl)
      `}
    }
    & p {
      ${tw`text-lg text-green-400 mb-6 
        lg:(text-2xl max-w-xl mb-8)
        `}
    }
    & button {
      ${tw`flex border-4 border-green-800 py-4 px-8 rounded-lg cursor-pointer text-xl text-gray-300 font-bold capitalize 
      bg-gray-700 bg-opacity-30 transition-all
      hover:(bg-gray-600 bg-opacity-20)
      focus:(text-gray-100 outline-none)
      active:(bg-gray-600 outline-none bg-opacity-30)
      focus-visible:(ring-offset-2 ring-green-700 outline-none)
      
      `}
      img {
        margin-left: 10px;
        width: 30px;
        object-fit: contain;
      }
    }
  `
]);
