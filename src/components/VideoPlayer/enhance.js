import React, { useState, useEffect, useRef } from "react";

import {
  getEmbedUrl,
  detectDiffTwoPoint,
  isMovingOnCorner,
  isMovingOnVertical,
} from "../../utils/utils";
import {
  DEFAULT_TOP,
  DEFAULT_LEFT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
} from "../../utils/constants";

const enhance = (VideoPlayer) => (props) => {
  const [isUpdatingPosition, setIsUpdatingPosition] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isMarkStartPoint, setIsMarkStartPoint] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
  });
  const [resizedModal, setResizedModal] = useState({
    resizedWidth: DEFAULT_WIDTH,
    resizedHeight: DEFAULT_HEIGHT,
  });

  const containerRef = useRef(null);
  const wrapIframeRef = useRef(null);

  useEffect(() => {
    function handleMouseUp(e) {
      onStopPress();
    }
    window.addEventListener("mouseup", handleMouseUp, true);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp, true);
    };
  }, []);

  const onStopPress = () => {
    setIsPressing(false);
    setStartPoint({ x: 0, y: 0 });
    setIsMarkStartPoint(false);
    setIsUpdatingPosition(false);
  };

  const onCalculateDiff = ({ x, y }) => {
    if (isMarkStartPoint) {
      return detectDiffTwoPoint(startPoint, { x, y });
    }

    setStartPoint({ x, y });
    setIsMarkStartPoint(true);
    return { diffLeft: 0, diffTop: 0 };
  };

  const onDetermineCursor = ({ x, y }) => {
    const currentPoint = { x, y };
    const wrapIframeNode = wrapIframeRef.current;
    const param = {
      currentPoint,
      currentPosition,
      resizedModal,
      cornerNum: "1",
    };

    if (isMovingOnCorner(param)) {
      wrapIframeNode.style.cursor = "nw-resize";
    } else if (isMovingOnCorner({ ...param, cornerNum: "2" })) {
      wrapIframeNode.style.cursor = "ne-resize";
    } else if (isMovingOnCorner({ ...param, cornerNum: "3" })) {
      wrapIframeNode.style.cursor = "ne-resize";
    } else if (isMovingOnCorner({ ...param, cornerNum: "4" })) {
      wrapIframeNode.style.cursor = "nw-resize";
    } else if (
      isMovingOnVertical(currentPoint, currentPosition, resizedModal)
    ) {
      wrapIframeNode.style.cursor = "w-resize";
    } else {
      wrapIframeNode.style.cursor = "s-resize";
    }

    if (!isPressing || isUpdatingPosition) return;
    onResizeModal({ x, y });
  };

  const onChangePosition = ({ x, y }) => {
    const containerNode = containerRef.current;
    const positionDiff = onCalculateDiff({ x, y });

    setStartPoint({ x, y });
    setCurrentPosition({
      x: currentPosition.x + positionDiff.diffLeft,
      y: currentPosition.y + positionDiff.diffTop,
    });

    containerNode.style.left = `${currentPosition.x + positionDiff.diffLeft}px`;
    containerNode.style.top = `${currentPosition.y + positionDiff.diffTop}px`;
  };

  const onResizeModal = ({ x, y }) => {
    const containerNode = containerRef.current;
    const wrapIframeNode = wrapIframeRef.current;
    const positionDiff = onCalculateDiff({ x, y });
    setStartPoint({ x, y });

    const { diffLeft, diffTop, direction } = positionDiff;
    const { resizedWidth, resizedHeight } = resizedModal;

    if (direction === "left") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        // update position
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;

        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y,
        });

        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth + Math.abs(diffLeft),
        });
      } else {
        console.log("giam size");
        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth - Math.abs(diffLeft),
        });
      }
    }

    if (direction === "right") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        // update position
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;

        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y,
        });

        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth - Math.abs(diffLeft),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth + Math.abs(diffLeft),
        });
      }
    }

    if (direction === "top") {
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
        // update position
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;
        setCurrentPosition({
          x: currentPosition.x,
          y: currentPosition.y + positionDiff.diffTop,
        });

        setResizedModal({
          ...resizedModal,
          resizedHeight: resizedHeight + Math.abs(diffTop),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedHeight: resizedHeight - Math.abs(diffTop),
        });
      }
    }

    if (direction === "bottom") {
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
        // update position
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;
        setCurrentPosition({
          x: currentPosition.x,
          y: currentPosition.y + positionDiff.diffTop,
        });

        setResizedModal({
          ...resizedModal,
          resizedHeight: resizedHeight - Math.abs(diffTop),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedHeight: resizedHeight + Math.abs(diffTop),
        });
      }
    }

    if (direction === "cross" && wrapIframeNode.style.cursor === "ne-resize") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;
        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y,
        });

        if (diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth + Math.abs(diffLeft),
            resizedHeight: resizedHeight + Math.abs(diffTop),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth - Math.abs(diffLeft),
            resizedHeight: resizedHeight - Math.abs(diffTop),
          });
        }
      } else {
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;

        setCurrentPosition({
          x: currentPosition.x,
          y: currentPosition.y + positionDiff.diffTop,
        });

        if (diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth - Math.abs(diffLeft),
            resizedHeight: resizedHeight - Math.abs(diffTop),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth + Math.abs(diffLeft),
            resizedHeight: resizedHeight + Math.abs(diffTop),
          });
        }
      }
    }

    if (direction === "cross" && wrapIframeNode.style.cursor === "nw-resize") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;

        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y + positionDiff.diffTop,
        });

        if (diffLeft > 0 && diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth - Math.abs(diffLeft),
            resizedHeight: resizedHeight - Math.abs(diffTop),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth + Math.abs(diffLeft),
            resizedHeight: resizedHeight + Math.abs(diffTop),
          });
        }
      } else {
        if (diffLeft > 0 && diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth + Math.abs(diffLeft),
            resizedHeight: resizedHeight + Math.abs(diffTop),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth: resizedWidth - Math.abs(diffLeft),
            resizedHeight: resizedHeight - Math.abs(diffTop),
          });
        }
      }
    }
  };

  return (
    <VideoPlayer
      url={getEmbedUrl(props.url)}
      onCloseModal={props.setIsOpenModal}
      setIsUpdatingPosition={setIsUpdatingPosition}
      isPressing={isPressing}
      containerRef={containerRef}
      wrapIframeRef={wrapIframeRef}
      resizedModal={resizedModal}
      setIsPressing={setIsPressing}
      onChangePosition={onChangePosition}
      onResizeModal={onResizeModal}
      onStopPress={onStopPress}
      onDetermineCursor={onDetermineCursor}
    />
  );
};

export default enhance;
