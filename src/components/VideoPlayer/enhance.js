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
} from "../../utils/constants";

const enhance = (VideoPlayer) => (props) => {
  const isUpdatingPosition = useRef(false);

  const resizeType = useRef('');

  const isPressing = useRef(false);

  const [frameInfo, setFrameInfo] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  });

  const [pointerType, setPointerType] = useState("default");

  useEffect(() => {
    function handleMouseMove(e) {
      onDetermineCursor({ x: e.clientX, y: e.clientY });
    }

    function handleMouseUp(e) {
      isPressing.current = false;
      resizeType.current = '';
      isUpdatingPosition.current = false;
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
  }, [frameInfo, pointerType]);

  const onDetermineCursor = ({ x, y }) => {
    const currentPoint = { x, y };

    const bottomRight = {
      x: frameInfo.x + frameInfo.width + 10,
      y: frameInfo.y + frameInfo.height + 10,
    };

    const topRight = {
      x: frameInfo.x + frameInfo.width + 10,
      y: frameInfo.y,
    };

    const bottomLeft = {
      x: frameInfo.x,
      y: frameInfo.y + frameInfo.height + 10,
    };

    // top left
    if (currentPoint.x >= frameInfo.x - 10 && currentPoint.x <= frameInfo.x &&
      currentPoint.y >= frameInfo.y - 10 && currentPoint.y <= frameInfo.y) {
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
    else if (currentPoint.y <= frameInfo.y && currentPoint.y >= frameInfo.y - 10) {
      setPointerType('ns-resize');
      resizeType.current = 'top';
    }
    // bottom
    else if (currentPoint.y >= bottomLeft.y && currentPoint.y <= bottomLeft.y + 10) {
      setPointerType('ns-resize');
      resizeType.current = 'bottom';
    }
    // left
    else if (currentPoint.x <= frameInfo.x && currentPoint.x >= frameInfo.x - 10) {
      setPointerType('ew-resize');
      resizeType.current = 'left';
    }
    // right
    else if (currentPoint.x >= topRight.x && currentPoint.x <= topRight.x + 10) {
      setPointerType('ew-resize');
      resizeType.current = 'right';
    }
    else if (currentPoint.x >= frameInfo.x + 10 && currentPoint.x <= topRight.x - 10 &&
      currentPoint.y >= frameInfo.y + 10 && currentPoint.y <= bottomRight.y - 10 &&
      !resizeType && isPressing.current) {
      console.log('Here');
      setPointerType('move');
      isUpdatingPosition.current = true;
    }
    else if (!isPressing.current) {
      setPointerType('default');
    }

    if (!isPressing.current) {
      resizeType.current = '';
      isUpdatingPosition.current = false;
      return;
    }

    if (isUpdatingPosition.current) {
      onChangePosition({ x, y });
    }
    else if (resizeType.current) {
      onResizeModal({ x, y });
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

    switch (resizeType.current) {
      case 'top':
        newHeight = y <= frameInfo.y ?
          frameInfo.height + frameInfo.y - y
          :
          frameInfo.height - (y - frameInfo.y);

        if (newHeight > MIN_HEIGHT) {
          setFrameInfo((prev) => ({
            ...prev,
            y,
            height: newHeight
          }));
        }
        break;
      case 'left':
        newWidth = x <= frameInfo.x ?
          frameInfo.width + frameInfo.x - x
          :
          frameInfo.width - (x - frameInfo.x);

        if (newWidth > MIN_WIDTH) {
          setFrameInfo((prev) => ({
            ...prev,
            x,
            width: newWidth
          }));
        }
        break;
      case 'right':
        setFrameInfo((prev) => ({
          ...prev,
          width: x >= frameInfo.x + prev.width + 10 ?
            prev.width + (x - (frameInfo.x + prev.width + 10))
            :
            x - frameInfo.x
        }));
        break;
      case 'bottom':
        setFrameInfo((prev) => ({
          ...prev,
          height: y >= frameInfo.y + prev.height + 10 ?
            prev.height + (y - (frameInfo.y + prev.height + 10))
            :
            y - frameInfo.y
        }));
        break;
      case 'top-left':
        break;
      case 'bottom-right':
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
