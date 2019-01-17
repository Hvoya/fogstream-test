export const secondsToHours = (sec: number | undefined) => {
  const minutes = Math.floor(sec! / 60);
  const seconds = Math.floor(sec! - minutes * 60);

  return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};
