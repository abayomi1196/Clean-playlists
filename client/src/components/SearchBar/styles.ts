import tw, { styled, css } from "twin.macro";

export const Wrapper = styled.div(() => [
  tw`inline-block relative w-11/12 max-w-2xl mx-auto mb-5
    lg:(mb-12)
  `,
  css`
    & {
      input {
        ${tw`
          py-6 px-10 text-gray-200 bg-gray-700 bg-opacity-50 border-2 border-white w-full text-base shadow-xl transition-all
          focus:(bg-opacity-40 outline-none)
          focus-visible:(ring-offset-2 ring-white ring-opacity-40)

          lg:(text-lg)
          `}
        border-radius: 30px;
        height: 65px;
      }
    }
  `
]);
