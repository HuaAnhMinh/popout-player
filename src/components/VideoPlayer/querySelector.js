const setupQuerySelectorForElements = () => {
  const pageWrapper = document.getElementById('page-wrapper');
  const modalWrapper = document.getElementById('modal-wrapper');
  const outsideTopLeft = document.getElementById('outside-top-left');
  const top = document.getElementById('top');
  const outsideTopRight = document.getElementById('outside-top-right');
  const left = document.getElementById('left');
  const right = document.getElementById('right');
  const outsideBottomLeft = document.getElementById('outside-bottom-left');
  const bottom = document.getElementById('bottom');
  const outsideBottomRight = document.getElementById('outside-bottom-right');
  const moveOverlay = document.getElementById('move-overlay');
  const videoPlayerModal = document.getElementById('video-player-modal');
  const resizeOverlay = document.getElementById('resize-overlay');
  const iframeVideoPlayer = document.getElementById('iframe-video-player');
  const insideTopLeft = document.getElementById('inside-top-left');
  const insideTopRight = document.getElementById('inside-top-right');
  const insideBottomLeft = document.getElementById('inside-bottom-left');
  const insideBottomRight = document.getElementById('inside-bottom-right');
  const moveOverlayContent = document.getElementById('move-overlay__content');

  return {
    pageWrapper,
    modalWrapper,
    outsideTopLeft,
    top,
    outsideTopRight,
    left,
    right,
    outsideBottomLeft,
    bottom,
    outsideBottomRight,
    moveOverlay,
    videoPlayerModal,
    resizeOverlay,
    iframeVideoPlayer,
    insideTopLeft,
    insideTopRight,
    insideBottomLeft,
    insideBottomRight,
    moveOverlayContent,
  };
};

export default setupQuerySelectorForElements;