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
  const pressedPoint = useRef({});

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
      onHandleInteraction({ x: e.clientX, y: e.clientY });
    }

    function handleMouseDown(e) {
      isPressing.current = true;
      pressedPoint.current = { x: e.clientX, y: e.clientY, frameX: frameInfo.x, frameY: frameInfo.y, };
      onHandleInteraction({ x: e.clientX, y: e.clientY });
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
      if (interaction.current === INTERACTIONS.MOVING) {
        return onChangePosition({ x, y });
      }
      else {
        return onResizeModal({ x, y });
      }
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
      setPointerType('ew-resize');
      interaction.current = INTERACTIONS.RESIZE_RIGHT;
    }
    else if (currentPoint.x >= frameInfo.x + 1 && currentPoint.x <= topRight.x - 1 &&
      currentPoint.y >= frameInfo.y + 1 && currentPoint.y <= bottomRight.y - 1) {
      if (isPressing.current) {
        setPointerType('move');
        interaction.current = INTERACTIONS.MOVING;
      }
      else {
        setPointerType('default');
        interaction.current = INTERACTIONS.NONE;
      }
    }
    else {
      setPointerType('default');
      interaction.current = INTERACTIONS.NONE;
    }
  };

  const onChangePosition = ({ x, y }) => {
    const positionDiff = detectDiffTwoPoint({
      x: pressedPoint.current.x,
      y: pressedPoint.current.y
    }, {
      x,
      y
    });

    setFrameInfo((prev) => ({
      ...prev,
      x: pressedPoint.current.frameX + positionDiff.diffLeft,
      y: pressedPoint.current.frameY + positionDiff.diffTop,
    }));
  };

  const onResizeModal = ({ x, y }) => {
    switch (interaction.current) {
      case INTERACTIONS.RESIZE_TOP:
        return onResizeTop(y);
      case INTERACTIONS.RESIZE_LEFT:
        return onResizeLeft(x);
      case INTERACTIONS.RESIZE_RIGHT:
        return onResizeRight(x);
      case INTERACTIONS.RESIZE_BOTTOM:
        return onResizeBottom(y);
      case INTERACTIONS.RESIZE_TOP_LEFT:
        return onResizeTopLeft(x, y);
      case INTERACTIONS.RESIZE_TOP_RIGHT:
        return onResizeTopRight(x, y);
      case INTERACTIONS.RESIZE_BOTTOM_RIGHT:
        return onResizeBottomRight(x, y);
      case INTERACTIONS.RESIZE_BOTTOM_LEFT:
        return onResizeBottomLeft(x, y);
      default:
        break;
    }
  };

  const onResizeTop = (y) => {
    const height = y <= frameInfo.y ?
    frameInfo.height + frameInfo.y - y
    :
    frameInfo.height - (y - frameInfo.y);

    if (height >= MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        y,
        height
      }));
    }
  };

  const onResizeRight = (x) => {
    setFrameInfo((prev) => ({
      ...prev,
      width: x >= frameInfo.x + prev.width ?
        prev.width + (x - (frameInfo.x + prev.width))
        :
        x - frameInfo.x
    }));
  };

  const onResizeBottom = (y) => {
    setFrameInfo((prev) => ({
      ...prev,
      height: y >= frameInfo.y + prev.height ?
        prev.height + (y - (frameInfo.y + prev.height))
        :
        y - frameInfo.y
    }));
  };

  const onResizeLeft = (x) => {
    const width = x <= frameInfo.x ?
    frameInfo.width + frameInfo.x - x
    :
    frameInfo.width - (x - frameInfo.x);

    if (width >= MIN_WIDTH) {
      setFrameInfo((prev) => ({
        ...prev,
        x,
        width
      }));
    }
  };

  const onResizeTopLeft = (x, y) => {
    let width, height;

    if (x >= frameInfo.x) {
      width = frameInfo.width - (x - frameInfo.x);
    }
    else {
      width = frameInfo.width + (frameInfo.x - x);
    }

    if (y >= frameInfo.y) {
      height = frameInfo.height - (y - frameInfo.y);
    }
    else {
      height = frameInfo.height + (frameInfo.y - y);
    }

    if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
      setFrameInfo({
        x,
        y,
        width,
        height,
      });
    }
    else if (width >= MIN_WIDTH && height < MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        x,
        width
      }));
    }
    else if (height >= MIN_HEIGHT && width < MIN_WIDTH) {
      setFrameInfo((prev) => ({
        ...prev,
        y,
        height
      }));
    }
  };

  const onResizeTopRight = (x, y) => {
    let width, height;

    if (x >= frameInfo.x + frameInfo.width) {
      width = frameInfo.width + (x - (frameInfo.x + frameInfo.width));
    }
    else {
      width = frameInfo.width - ((frameInfo.x + frameInfo.width) - x);
    }

    if (y >= frameInfo.y) {
      height = frameInfo.height - (y - frameInfo.y);
    }
    else {
      height = frameInfo.height + (frameInfo.y - y);
    }

    if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        y,
        width,
        height,
      }));
    }
    else if (width >= MIN_WIDTH && height < MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        width
      }));
    }
    else if (height >= MIN_HEIGHT && width < MIN_WIDTH) {
      setFrameInfo((prev) => ({
        ...prev,
        height,
        y,
      }));
    }
  };

  const onResizeBottomRight = (x, y) => {
    let width, height;

    if (x >= frameInfo.x + frameInfo.width) {
      width = frameInfo.width + (x - (frameInfo.x + frameInfo.width + 10));
    }
    else {
      width = frameInfo.width - ((frameInfo.x + frameInfo.width + 10) - x);
    }

    if (y >= frameInfo.y + frameInfo.height) {
      height = frameInfo.height + (y - (frameInfo.y + frameInfo.height + 10));
    }
    else {
      height = frameInfo.height - ((frameInfo.y + frameInfo.height + 10) - y);
    }

    setFrameInfo((prev) => ({
      ...prev,
      width,
      height,
    }));
  };

  const onResizeBottomLeft = (x, y) => {
    let width, height;

    if (x >= frameInfo.x) {
      width = frameInfo.width - (x - frameInfo.x);
    }
    else {
      width = frameInfo.width + (frameInfo.x - x);
    }

    if (y >= frameInfo.y + frameInfo.height) {
      height = frameInfo.height + (y - (frameInfo.y + frameInfo.height));
    }
    else {
      height = frameInfo.height - ((frameInfo.y + frameInfo.height) - y);
    }

    if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        x,
        width,
        height
      }));
    }
    else if (width >= MIN_WIDTH && height < MIN_HEIGHT) {
      setFrameInfo((prev) => ({
        ...prev,
        width,
        x,
      }));
    }
    else if (height >= MIN_HEIGHT && width < MIN_WIDTH) {
      setFrameInfo((prev) => ({
        ...prev,
        height
      }));
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
