import React, { useState } from "react";

import {
  detectDiffOnPull,
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
  const [positionDiff, setPositionDiff] = useState({ diffLeft: 0, diffTop: 0 });
  const [sizeDiff, setSizeDiff] = useState({ diffLeft: 0, diffTop: 0 });

  const containerRef = React.createRef();
  const wrapIframeRef = React.createRef();

  const onStopPress = () => {
    setCurrentPosition({
      x: currentPosition.x + positionDiff.diffLeft,
      y: currentPosition.y + positionDiff.diffTop,
    });
    setIsPressing(false);
    setStartPoint({ x: 0, y: 0 });
    setIsMarkStartPoint(false);
    setIsUpdatingPosition(false);
    setSizeDiff({ diffLeft: 0, diffTop: 0 });
    setPositionDiff({ diffLeft: 0, diffTop: 0 });
  };

  const onCalculateDiff = ({ x, y }) => {
    if (isMarkStartPoint) {
      return detectDiffOnPull(startPoint, { x, y });
    }
    setStartPoint({ x, y });
    setIsMarkStartPoint(true);
  };

  const onDetermineCursor = ({ clientX: x, clientY: y }) => {
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
    onResizeModal({ clientX: x, clientY: y });
  };

  const onChangePosition = ({ clientX: x, clientY: y }) => {
    const containerNode = containerRef.current;
    const positionDiff = onCalculateDiff({ x, y });

    if (!positionDiff) return;
    setPositionDiff(positionDiff);
    containerNode.style.left = `${currentPosition.x + positionDiff.diffLeft}px`;
    containerNode.style.top = `${currentPosition.y + positionDiff.diffTop}px`;
  };

  const onResizeModal = ({ clientX: x, clientY: y }) => {
    const containerNode = containerRef.current;
    const wrapIframeNode = wrapIframeRef.current;
    const positionDiff = onCalculateDiff({ x, y });

    if (!positionDiff) return;

    const { diffLeft, diffTop, direction } = positionDiff;
    const { resizedWidth, resizedHeight } = resizedModal;

    if (direction === "left") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        // update position
        setPositionDiff({ diffLeft: positionDiff.diffLeft, diffTop: 0 });
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;

        setResizedModal({
          ...resizedModal,
          resizedWidth:
            resizedWidth + Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedWidth:
            resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
        });
      }
      setSizeDiff(positionDiff);
    }

    if (direction === "right") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        setPositionDiff({ diffLeft: positionDiff.diffLeft, diffTop: 0 });
        // update position
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;

        setResizedModal({
          ...resizedModal,
          resizedWidth:
            resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedWidth:
            resizedWidth + Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft),
        });
      }
      setSizeDiff(positionDiff);
    }

    if (direction === "top") {
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
        // update position
        setPositionDiff({ diffTop: positionDiff.diffTop, diffLeft: 0 });
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;

        setResizedModal({
          ...resizedModal,
          resizedHeight:
            resizedHeight + Math.abs(diffTop) - Math.abs(sizeDiff.diffTop),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedHeight:
            resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
        });
      }
      setSizeDiff(positionDiff);
    }

    if (direction === "bottom") {
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
        // update position
        setPositionDiff({ diffTop: positionDiff.diffTop, diffLeft: 0 });
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;
        setResizedModal({
          ...resizedModal,
          resizedHeight:
            resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedHeight:
            resizedHeight + (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
        });
      }
      setSizeDiff(positionDiff);
    }

    if (direction === "cross" && wrapIframeNode.style.cursor === "ne-resize") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        setPositionDiff({ diffLeft: positionDiff.diffLeft, diffTop: 0 });
        containerNode.style.left = `${
          currentPosition.x + positionDiff.diffLeft
        }px`;

        if (diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth + (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight + (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        }
      } else {
        setPositionDiff({ diffTop: positionDiff.diffTop, diffLeft: 0 });
        containerNode.style.top = `${
          currentPosition.y + positionDiff.diffTop
        }px`;

        if (diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth + (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight + (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        }
      }
      setSizeDiff(positionDiff);
    }

    if (direction === "cross" && wrapIframeNode.style.cursor === "nw-resize") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        setPositionDiff(positionDiff);
        if (diffLeft > 0 && diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth + (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight + (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        }
      } else {
        setPositionDiff({ diffLeft: 0, diffTop: 0 });
        if (diffLeft > 0 && diffTop > 0) {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth + (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight + (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        } else {
          setResizedModal({
            ...resizedModal,
            resizedWidth:
              resizedWidth - (Math.abs(diffLeft) - Math.abs(sizeDiff.diffLeft)),
            resizedHeight:
              resizedHeight - (Math.abs(diffTop) - Math.abs(sizeDiff.diffTop)),
          });
        }
      }
      setSizeDiff(positionDiff);
    }
  };

  return (
    <VideoPlayer
      isUpdatingPosition={isUpdatingPosition}
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
