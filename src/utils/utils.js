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