export const delay = (sec: number) => {
  new Promise((res) => setTimeout(res, sec * 1000));
};
