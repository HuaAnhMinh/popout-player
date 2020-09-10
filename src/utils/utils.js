export const validateUrl = (url) => {
  if (url.includes("https://www.youtube.com/")) return true;
  return false;
};

export const getEmbedUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;

  return `https://www.youtube.com/embed/${videoId}`;
};

export const detectDiffTwoPoint = (start, end) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  let direction;

  // console.log("deltaX", deltaX, "deltaY", deltaY);
  if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
    direction = "right";
  } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
    direction = "left";
  } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
    direction = "bottom";
  } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
    direction = "top";
  } else if (Math.abs(deltaY) === Math.abs(deltaX) && deltaX !== 0) {
    direction = "cross";
  } else {
    direction = "";
  }

  return { diffLeft: deltaX, diffTop: deltaY, direction };
};
