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
  MIN_HEIGHT,
  MIN_WIDTH,
} from "../../utils/constants";

const enhance = (VideoPlayer) => (props) => {
  const isUpdatingPosition = useRef(false);
  const resizeType = useRef('');
  const isPressing = useRef(false);
  const isMarkStartPoint = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const currentPointer = useRef("");
  const [currentPosition, setCurrentPosition] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
  });
  const [resizedModal, setResizedModal] = useState({
    resizedWidth: DEFAULT_WIDTH,
    resizedHeight: DEFAULT_HEIGHT,
  });
  const [pointerType, setPointerType] = useState("default");

  useEffect(() => {
    function handleMouseMove(e) {
      onDetermineCursor({ x: e.clientX, y: e.clientY });
    }
    function handleMouseUp(e) {
      isPressing.current = false;
    }
    function handleMouseDown(e) {
      isPressing.current = true;
    }

    window.addEventListener("mousemove", handleMouseMove, true);
    window.addEventListener("mouseup", handleMouseUp, true);
    window.addEventListener("mousedown", handleMouseDown, true);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove, true);
      window.removeEventListener("mouseup", handleMouseUp, true);
      window.removeEventListener("mousedown", handleMouseDown, true);
    };
  }, [resizedModal, currentPosition, pointerType]);

  function setIsPressing(val) {
    isPressing.current = val;
  }

  function setIsMarkStartPoint(val) {
    isMarkStartPoint.current = val;
  }

  function setStartPoint(val) {
    startPoint.current = val;
  }

  function setIsUpdatingPosition(val) {
    isUpdatingPosition.current = val;
  }

  function setCurrentPointer(val) {
    currentPointer.current = val;
  }

  const onStopPress = () => {
    setIsPressing(false);
    setStartPoint({ x: 0, y: 0 });
    setIsMarkStartPoint(false);
    setIsUpdatingPosition(false);
    setCurrentPointer("");
  };

  const onStartPress = (e) => {
    const isHeaderArea = document
      .getElementsByClassName("header")[0]
      .contains(e.target);

    setIsPressing(true);
    setCurrentPointer(pointerType);
    if (isHeaderArea) {
      setIsUpdatingPosition(true);
      return;
    }
  };

  const onCalculateDiff = ({ x, y }) => {
    if (isMarkStartPoint.current) {
      return detectDiffTwoPoint(startPoint.current, { x, y });
    }

    setStartPoint({ x, y });
    setIsMarkStartPoint(true);
    return { diffLeft: 0, diffTop: 0 };
  };

  const onDetermineCursor = ({ x, y }) => {
    const currentPoint = { x, y };
    const param = {
      currentPoint,
      currentPosition,
      resizedModal,
      cornerNum: "1",
    };

    const bottomRight = {
      x: currentPosition.x + resizedModal.resizedWidth + 10,
      y: currentPosition.y + resizedModal.resizedHeight + 10,
    };

    const topRight = {
      x: currentPosition.x + resizedModal.resizedWidth + 10,
      y: currentPosition.y,
    };

    const bottomLeft = {
      x: currentPosition.x,
      y: currentPosition.y + resizedModal.resizedHeight + 10,
    };

    // top left
    if (currentPoint.x >= currentPosition.x - 10 && currentPoint.x <= currentPosition.x &&
      currentPoint.y >= currentPosition.y - 10 && currentPoint.y <= currentPosition.y) {
      setPointerType('nwse-resize');
      resizeType.current = 'top-left';
    }
    // bottom right
    else if (currentPoint.x >= bottomRight.x && currentPoint.x <= bottomRight.x + 10 &&
      currentPoint.y >= bottomRight.y && currentPoint.y <= bottomRight.y + 10) {
      setPointerType('nwse-resize');
      resizeType.current = 'bottom-right';
    }
    // top right
    else if (currentPoint.x <= topRight.x + 10 && currentPoint.x >= topRight.x &&
      currentPoint.y >= topRight.y - 10 && currentPoint.y <= topRight.y) {
      setPointerType('nesw-resize');
      resizeType.current = 'top-right';
    }
    // bottom left
    else if (currentPoint.x <= bottomLeft.x && currentPoint.x >= bottomLeft.x - 10 &&
      currentPoint.y >= bottomLeft.y && currentPoint.y <= bottomLeft.y + 10) {
      setPointerType('nesw-resize');
      resizeType.current = 'bottom-left';
    }
    // top
    else if (currentPoint.y <= currentPosition.y && currentPoint.y >= currentPosition.y - 10) {
      setPointerType('ns-resize');
      resizeType.current = 'top';
    }
    // bottom
    else if (currentPoint.y >= bottomLeft.y && currentPoint.y <= bottomLeft.y + 10) {
      setPointerType('ns-resize');
      resizeType.current = 'bottom';
    }
    // left
    else if (currentPoint.x <= currentPosition.x && currentPoint.x >= currentPosition.x - 10) {
      setPointerType('ew-resize');
      resizeType.current = 'left';
    }
    // right
    else if (currentPoint.x >= topRight.x && currentPoint.x <= topRight.x + 10) {
      setPointerType('ew-resize');
      resizeType.current = 'right';
    }
    else {
      if (!isPressing.current) {
        setPointerType('default');
      }
      // resizeType = '';
    }

    if (!isPressing.current) return;
    // if (isUpdatingPosition.current) {
    //   onChangePosition({ x, y });
    //   return;
    // }
    if (isPressing.current && resizeType.current) {
      onResizeModal({ x, y });
    }
  };

  const onChangePosition = ({ x, y }) => {
    const positionDiff = onCalculateDiff({ x, y });
    setStartPoint({ x, y });

    setCurrentPosition({
      x: currentPosition.x + positionDiff.diffLeft,
      y: currentPosition.y + positionDiff.diffTop,
    });
  };

  useEffect(() => {
    
  }, [currentPosition.y]);

  const onResizeModal = ({ x, y }) => {
    let newHeight, newWidth;

    switch (resizeType.current) {
      case 'top':
        newHeight = y <= currentPosition.y ?
          resizedModal.resizedHeight + currentPosition.y - y
          :
          resizedModal.resizedHeight - (y - currentPosition.y);

        if (newHeight > MIN_HEIGHT) {
          setCurrentPosition((prev) => ({
            ...prev,
            y
          }));
        }

        setResizedModal((prev) => ({
          ...prev,
          resizedHeight: newHeight
        }));
        break;
      case 'left':
        newWidth = x <= currentPosition.x ?
          resizedModal.resizedWidth + currentPosition.x - x
          :
          resizedModal.resizedWidth - (x - currentPosition.x);

        if (newWidth > MIN_WIDTH) {
          setCurrentPosition((prev) => ({
            ...prev,
            x
          }));
        }

        setResizedModal((prev) => ({
          ...prev,
          resizedWidth: newWidth
        }));
        break;
      case 'right':
        setResizedModal((prev) => ({
          ...prev,
          resizedWidth: x >= currentPosition.x + prev.resizedWidth + 10 ?
            prev.resizedWidth + (x - (currentPosition.x + prev.resizedWidth + 10))
            :
            x - currentPosition.x
        }));
        break;
      case 'bottom':
        setResizedModal((prev) => ({
          ...prev,
          resizedHeight: y >= currentPosition.y + prev.resizedHeight + 10 ?
            prev.resizedHeight + (y - (currentPosition.y + prev.resizedHeight + 10))
            :
            y - currentPosition.y
        }));
        break;
      default:
        break;
    }
  };

  return (
    <VideoPlayer
      url={getEmbedUrl(props.url)}
      onCloseModal={props.setIsOpenModal}
      isPressing={isPressing}
      pointerType={pointerType}
      resizedModal={resizedModal}
      currentPosition={currentPosition}
      onStartPress={onStartPress}
    />
  );
};

export default enhance;
