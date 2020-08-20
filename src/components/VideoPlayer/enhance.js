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
  const isUpdatingPosition = useRef(false);
  const isPressing = useRef(false);
  const isMarkStartPoint = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
  });
  const [resizedModal, setResizedModal] = useState({
    resizedWidth: DEFAULT_WIDTH,
    resizedHeight: DEFAULT_HEIGHT,
  });
  const [pointerType, setPointerType] = useState("s-resize");

  useEffect(() => {
    function handleMouseMove(e) {
      onDetermineCursor({ x: e.clientX, y: e.clientY });
    }
    function handleMouseUp(e) {
      onStopPress();
    }

    window.addEventListener("mousemove", handleMouseMove, true);
    window.addEventListener("mouseup", handleMouseUp, true);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove, true);
      window.removeEventListener("mouseup", handleMouseUp, true);
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

  const onStopPress = () => {
    setIsPressing(false);
    setStartPoint({ x: 0, y: 0 });
    setIsMarkStartPoint(false);
    setIsUpdatingPosition(false);
  };

  const onStartPress = (e) => {
    const isHeaderArea = document
      .getElementsByClassName("header")[0]
      .contains(e.target);

    setIsPressing(true);
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

    if (isMovingOnCorner(param)) {
      setPointerType("nw-resize");
    } else if (isMovingOnCorner({ ...param, cornerNum: "2" })) {
      setPointerType("ne-resize");
    } else if (isMovingOnCorner({ ...param, cornerNum: "3" })) {
      setPointerType("ne-resize");
    } else if (isMovingOnCorner({ ...param, cornerNum: "4" })) {
      setPointerType("nw-resize");
    } else if (
      isMovingOnVertical(currentPoint, currentPosition, resizedModal)
    ) {
      setPointerType("w-resize");
    } else {
      setPointerType("s-resize");
    }

    if (!isPressing.current) return;
    if (isUpdatingPosition.current) {
      onChangePosition({ x, y });
      return;
    }
    onResizeModal({ x, y });
  };

  const onChangePosition = ({ x, y }) => {
    const positionDiff = onCalculateDiff({ x, y });
    setStartPoint({ x, y });

    setCurrentPosition({
      x: currentPosition.x + positionDiff.diffLeft,
      y: currentPosition.y + positionDiff.diffTop,
    });
  };

  const onResizeModal = ({ x, y }) => {
    const positionDiff = onCalculateDiff({
      x,
      y,
    });
    setStartPoint({ x, y });

    const { diffLeft, diffTop, direction } = positionDiff;
    const { resizedWidth, resizedHeight } = resizedModal;

    console.log("direction=", direction);
    if (direction === "left" && pointerType === "w-resize") {
      if (Math.abs(startPoint.current.x - currentPosition.x) < 10) {
        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y,
        });

        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth + Math.abs(diffLeft),
        });
      } else {
        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth - Math.abs(diffLeft),
        });
      }
    }

    if (direction === "right" && pointerType === "w-resize") {
      if (Math.abs(startPoint.current.x - currentPosition.x) < 10) {
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

    if (direction === "top" && pointerType === "s-resize") {
      debugger;
      if (Math.abs(startPoint.current.y - currentPosition.y) < 10) {
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

    if (direction === "bottom" && pointerType === "s-resize") {
      if (Math.abs(startPoint.current.y - currentPosition.y) < 10) {
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

    if (direction === "cross" && pointerType === "ne-resize") {
      if (Math.abs(startPoint.current.x - currentPosition.x) < 10) {
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

    if (direction === "cross" && pointerType === "nw-resize") {
      if (Math.abs(startPoint.current.x - currentPosition.x) < 10) {
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
      isPressing={isPressing}
      pointerType={pointerType}
      resizedModal={resizedModal}
      currentPosition={currentPosition}
      onStartPress={onStartPress}
    />
  );
};

export default enhance;
