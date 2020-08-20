import React, { useState, useEffect } from "react";

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
  const [pointerType, setPointerType] = useState("s-resize");

  useEffect(() => {
    function handleMouseMove(e) {
      console.log("on mouse move");
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

    if (!isPressing || isUpdatingPosition) return;
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
    // setStartPoint({ x, y });

    const { diffLeft, diffTop, direction } = positionDiff;
    const { resizedWidth, resizedHeight } = resizedModal;
    console.log(positionDiff);
    console.log(resizedWidth);

    if (direction === "left" && pointerType === "w-resize") {
      console.log("left");
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
        setCurrentPosition({
          x: currentPosition.x + positionDiff.diffLeft,
          y: currentPosition.y,
        });

        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth + Math.abs(diffLeft),
        });
      } else {
        console.log("giảm left");

        setResizedModal({
          ...resizedModal,
          resizedWidth: resizedWidth - Math.abs(diffLeft),
        });
      }
    }

    if (direction === "right" && pointerType === "w-resize") {
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
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
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
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
      if (Math.abs(startPoint.y - currentPosition.y) < 10) {
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
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
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
      if (Math.abs(startPoint.x - currentPosition.x) < 10) {
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
      pointerType={pointerType}
      resizedModal={resizedModal}
      currentPosition={currentPosition}
      setIsPressing={setIsPressing}
      onChangePosition={onChangePosition}
      onResizeModal={onResizeModal}
      onDetermineCursor={onDetermineCursor}
    />
  );
};

export default enhance;
