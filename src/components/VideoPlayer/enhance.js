/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

import {
  getEmbedUrl,
} from "../../utils/utils";
import {
  DEFAULT_TOP,
  DEFAULT_LEFT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  INTERACTIONS,
} from "../../utils/constants";
import setupQuerySelectorForElements from "./querySelector";
import { resizeBottom, resizeBottomLeft, resizeBottomRight, resizeLeft, resizeRight, resizeTop, resizeTopLeft, resizeTopRight } from "./resize";
import { moveModal } from "./move";

const enhance = (VideoPlayer) => (props) => {
  const [isPressing, setIsPressing] = useState(false);
  const interaction = useRef(INTERACTIONS.NONE);
  const pressedPoint = useRef({});
  const lastFramePoint = useRef({ x: DEFAULT_LEFT, y: DEFAULT_TOP, });
  const elements = useRef({});

  const [frameInfo, setFrameInfo] = useState({
    x: DEFAULT_LEFT,
    y: DEFAULT_TOP,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });

  const [pointerType, setPointerType] = useState("default");

  useEffect(() => {
    elements.current = setupQuerySelectorForElements();

    window.addEventListener('mousedown', (e) => {
      e.preventDefault();
      setIsPressing(true);
      elements.current.resizeOverlay.style.display = 'block';
      pressedPoint.current = {
        x: e.clientX,
        y: e.clientY,
        frameX: lastFramePoint.current.x,
        frameY: lastFramePoint.current.y,
      };
    });

    window.addEventListener('mouseup', () => {
      setIsPressing(false);
      setPointerType("default");
      elements.current.resizeOverlay.style.display = 'none';
      interaction.current = INTERACTIONS.NONE;
      pressedPoint.current = {};
    });

    window.addEventListener('mousemove', (e) => {
      if (interaction.current === INTERACTIONS.RESIZE_BOTTOM) {
        return resizeBottom(e.clientY, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_TOP) {
        return resizeTop(e.clientY, lastFramePoint, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_LEFT) {
        return resizeLeft(e.clientX, lastFramePoint, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_RIGHT) {
        return resizeRight(e.clientX, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_TOP_LEFT) {
        return resizeTopLeft(e.clientX, e.clientY, lastFramePoint, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_TOP_RIGHT) {
        return resizeTopRight(e.clientX, e.clientY, lastFramePoint, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_BOTTOM_LEFT) {
        return resizeBottomLeft(e.clientX, e.clientY, lastFramePoint, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.RESIZE_BOTTOM_RIGHT) {
        return resizeBottomRight(e.clientX, e.clientY, setFrameInfo);
      }
      else if (interaction.current === INTERACTIONS.MOVING) {
        return moveModal(e.clientX, e.clientY, pressedPoint, lastFramePoint, setFrameInfo);
      }
    });

    elements.current.bottom.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_BOTTOM;
        setPointerType('ns-resize');
      }
    });

    elements.current.top.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_TOP;
        setPointerType('ns-resize');
      }
    });

    elements.current.left.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_LEFT;
        setPointerType('ew-resize');
      }
    });

    elements.current.right.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_RIGHT;
        setPointerType('ew-resize');
      }
    });
  
    elements.current.insideTopLeft.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_TOP_LEFT;
        setPointerType('nwse-resize');
      }
    });

    elements.current.outsideTopLeft.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_TOP_LEFT;
        setPointerType('nwse-resize');
      }
    });

    elements.current.outsideTopRight.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_TOP_RIGHT;
        setPointerType('nesw-resize');
      }
    });

    elements.current.insideTopRight.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_TOP_RIGHT;
        setPointerType('nesw-resize');
      }
    });

    elements.current.outsideBottomLeft.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_BOTTOM_LEFT;
        setPointerType('nesw-resize');
      }
    });

    elements.current.insideBottomLeft.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_BOTTOM_LEFT;
        setPointerType('nesw-resize');
      }
    });

    elements.current.outsideBottomRight.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_BOTTOM_RIGHT;
        setPointerType('nwse-resize');
      }
    });

    elements.current.insideBottomRight.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.RESIZE_BOTTOM_RIGHT;
        setPointerType('nwse-resize');
      }
    });
    
    elements.current.modalWrapper.addEventListener('mouseenter', (e) => {
      elements.current.moveOverlay.style.display = 'block';
    });

    elements.current.modalWrapper.addEventListener('mouseleave', (e) => {
      elements.current.moveOverlay.style.display = 'none';
    });
  
    elements.current.moveOverlayContent.addEventListener('mousedown', (e) => {
      elements.current.moveOverlay.style.zIndex = 11;
    });

    elements.current.moveOverlayContent.addEventListener('mouseup', (e) => {
      elements.current.moveOverlay.style.zIndex = 3;
    });

    elements.current.moveOverlay.addEventListener('mousedown', (e) => {
      if (interaction.current === INTERACTIONS.NONE) {
        interaction.current = INTERACTIONS.MOVING;
        setPointerType('move');
      }
    });
  }, []);

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
