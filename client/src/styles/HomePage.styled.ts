import tw, { styled, css } from "twin.macro";

export const Wrapper = styled.div(() => [
  css`
    & {
      background: #181818;
      background-image: url("https://images.ctfassets.net/lnhrh9gqejzl/5OiDfagglC997svKNR8PIP/2e7224d344ed30ad2df1127f1e53fd83/Waterparks_16x9.jpg?fm=webp&q=80&w=1664"); /* fallback */
      background-image: url("https://images.ctfassets.net/lnhrh9gqejzl/5OiDfagglC997svKNR8PIP/2e7224d344ed30ad2df1127f1e53fd83/Waterparks_16x9.jpg?fm=webp&q=80&w=1664"),
        linear-gradient(#18181805, #1818181c);

      background-repeat: no-repeat;
      background-size: cover;
      ${tw`min-h-screen bg-blend-multiply relative`};
    }
  `
]);
