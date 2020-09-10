/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

import {
  getEmbedUrl,
  detectDiffTwoPoint,
} from "../../utils/utils";
import {
  DEFAULT_TOP,
  DEFAULT_LEFT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  MIN_HEIGHT,
  MIN_WIDTH,
  INTERACTIONS
} from "../../utils/constants";

const enhance = (VideoPlayer) => (props) => {
  const isPressing = useRef(false);
  const interaction = useRef(INTERACTIONS.NONE);

  const [frameInfo, setFrameInfo] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  });

  const [pointerType, setPointerType] = useState("default");

  useEffect(() => {
    function handleMouseMove(e) {
      onHandleInteraction({ x: e.clientX, y: e.clientY });
    }

    function handleMouseUp(e) {
      isPressing.current = false;
      interaction.current = INTERACTIONS.NONE;
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
  }, [frameInfo.x, frameInfo.y, frameInfo.width, frameInfo.height, pointerType]);

  const onHandleInteraction = ({ x, y }) => {
    const currentPoint = { x, y };

    if (isPressing.current && interaction.current !== INTERACTIONS.NONE) {
      onResizeModal({ x, y });
      if (interaction.current === INTERACTIONS.MOVING) {
        onChangePosition({ x, y });
      }
      else {
        onResizeModal({ x, y });
      }
      return;
    }

    const bottomRight = {
      x: frameInfo.x + frameInfo.width,
      y: frameInfo.y + frameInfo.height,
    };

    const topRight = {
      x: frameInfo.x + frameInfo.width,
      y: frameInfo.y,
    };

    const bottomLeft = {
      x: frameInfo.x,
      y: frameInfo.y + frameInfo.height,
    };

    // top left
    if (currentPoint.x >= frameInfo.x - 10 && currentPoint.x <= frameInfo.x &&
      currentPoint.y >= frameInfo.y - 10 && currentPoint.y <= frameInfo.y) {
      setPointerType('nwse-resize');
      interaction.current = INTERACTIONS.RESIZE_TOP_LEFT;
    }
    // bottom right
    else if (currentPoint.x >= bottomRight.x && currentPoint.x <= bottomRight.x + 10 &&
      currentPoint.y >= bottomRight.y && currentPoint.y <= bottomRight.y + 10) {
      setPointerType('nwse-resize');
      interaction.current = INTERACTIONS.RESIZE_BOTTOM_RIGHT;
    }
    // top right
    else if (currentPoint.x <= topRight.x + 10 && currentPoint.x >= topRight.x &&
      currentPoint.y >= topRight.y - 10 && currentPoint.y <= topRight.y) {
      setPointerType('nesw-resize');
      interaction.current = INTERACTIONS.RESIZE_TOP_RIGHT;
    }
    // bottom left
    else if (currentPoint.x <= bottomLeft.x && currentPoint.x >= bottomLeft.x - 10 &&
      currentPoint.y >= bottomLeft.y && currentPoint.y <= bottomLeft.y + 10) {
      setPointerType('nesw-resize');
      interaction.current = INTERACTIONS.RESIZE_BOTTOM_LEFT;
    }
    // top
    else if (currentPoint.y <= frameInfo.y && currentPoint.y >= frameInfo.y - 10) {
      setPointerType('ns-resize');
      interaction.current = INTERACTIONS.RESIZE_TOP;
    }
    // bottom
    else if (currentPoint.y >= bottomLeft.y && currentPoint.y <= bottomLeft.y + 10) {
      setPointerType('ns-resize');
      interaction.current = INTERACTIONS.RESIZE_BOTTOM;
    }
    // left
    else if (currentPoint.x <= frameInfo.x && currentPoint.x >= frameInfo.x - 10) {
      setPointerType('ew-resize');
      interaction.current = INTERACTIONS.RESIZE_LEFT;
    }
    // right
    else if (currentPoint.x >= topRight.x && currentPoint.x <= topRight.x + 10) {
      console.log('right');
      setPointerType('ew-resize');
      interaction.current = INTERACTIONS.RESIZE_RIGHT;
    }
    else if (currentPoint.x >= frameInfo.x + 10 && currentPoint.x <= topRight.x - 10 &&
      currentPoint.y >= frameInfo.y + 10 && currentPoint.y <= bottomRight.y - 10) {
      console.log('Here');
      setPointerType('move');
      interaction.current = INTERACTIONS.MOVING;
    }
    else {
      setPointerType('default');
      interaction.current = INTERACTIONS.NONE;
    }
  };

  const onChangePosition = ({ x, y }) => {
    const positionDiff = detectDiffTwoPoint(frameInfo, { x, y });

    setFrameInfo((prev) => ({
      ...prev,
      x: frameInfo.x + positionDiff.diffLeft,
      y: frameInfo.y + positionDiff.diffTop,
    }));
  };

  const onResizeModal = ({ x, y }) => {
    let newHeight, newWidth;

    switch (interaction.current) {
      case INTERACTIONS.RESIZE_TOP:
        newHeight = y <= frameInfo.y ?
          frameInfo.height + frameInfo.y - y
          :
          frameInfo.height - (y - frameInfo.y);

        if (newHeight >= MIN_HEIGHT) {
          setFrameInfo((prev) => ({
            ...prev,
            y,
            height: newHeight
          }));
        }
        break;
      case INTERACTIONS.RESIZE_LEFT:
        newWidth = x <= frameInfo.x ?
          frameInfo.width + frameInfo.x - x
          :
          frameInfo.width - (x - frameInfo.x);

        if (newWidth >= MIN_WIDTH) {
          setFrameInfo((prev) => ({
            ...prev,
            x,
            width: newWidth
          }));
        }
        break;
      case INTERACTIONS.RESIZE_RIGHT:
        setFrameInfo((prev) => ({
          ...prev,
          width: x >= frameInfo.x + prev.width + 10 ?
            prev.width + (x - (frameInfo.x + prev.width + 10))
            :
            x - frameInfo.x
        }));
        break;
      case INTERACTIONS.RESIZE_BOTTOM:
        setFrameInfo((prev) => ({
          ...prev,
          height: y >= frameInfo.y + prev.height + 10 ?
            prev.height + (y - (frameInfo.y + prev.height + 10))
            :
            y - frameInfo.y
        }));
        break;
      case INTERACTIONS.RESIZE_TOP_LEFT:
        break;
      case INTERACTIONS.RESIZE_BOTTOM_RIGHT:
        if (x >= frameInfo.x + frameInfo.width + 10) {
          newWidth = frameInfo.width + (x - (frameInfo.x + frameInfo.width + 10));
        }
        else {
          newWidth = frameInfo.width - ((frameInfo.x + frameInfo.width + 10) - x);
        }

        if (y >= frameInfo.y + frameInfo.height + 10) {
          newHeight = frameInfo.height + (y - (frameInfo.y + frameInfo.height + 10));
        }
        else {
          newHeight = frameInfo.height - ((frameInfo.y + frameInfo.height + 10) - y);
        }

        setFrameInfo((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
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
      frameInfo={frameInfo}
    />
  );
};

export default enhance;
