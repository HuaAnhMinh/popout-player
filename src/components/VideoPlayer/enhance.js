import React, { useState, useEffect, useRef } from 'react';

import {
  detectDiffTwoPoint,
  isMovingOnCorner,
  isMovingOnVertical,
} from '../../utils/utils';
import {
  DEFAULT_TOP,
  DEFAULT_LEFT,
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
} from '../../utils/constants';

const enhance = (VideoPlayer) => () => {
  const [isUpdatingPosition, setIsUpdatingPosition] = useState(false);
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
  const containerRef = useRef(null);
  const wrapIframeRef = useRef(null);

  function setIsMarkStartPoint(val) {
    isMarkStartPoint.current = val;
  }

  function setStartPoint(point) {
    startPoint.current = point;
  }

  useEffect(() => {
    function handleMouseMove(e) {
      onDetermineCursor({ x: e.clientX, y: e.clientY });
    }
    function handleMouseUp(e) {
      onStopPress();
    }
    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('mouseup', handleMouseUp, true);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('mouseup', handleMouseUp, true);
    };
  }, []);

  function onStopPress() {
    setCurrentPosition({
      x: currentPosition.x + 0,
      y: currentPosition.y + 0,
    });
    setIsPressing(false);
    setStartPoint({ x: 0, y: 0 });
    setIsMarkStartPoint(false);
    setIsUpdatingPosition(false);
  }

  function onCalculateDiff({ x, y }) {
    if (isMarkStartPoint.current) {
      return detectDiffTwoPoint(startPoint.current, { x, y });
    }

    setStartPoint({ x, y });
    setIsMarkStartPoint(true);
    return { diffLeft: 0, diffTop: 0 };
  }

  function onDetermineCursor({ x, y }) {
    const currentPoint = { x, y };
    const wrapIframeNode = wrapIframeRef.current;
    const param = {
      currentPoint,
      currentPosition,
      resizedModal,
      cornerNum: '1',
    };

    if (isMovingOnCorner(param)) {
      wrapIframeNode.style.cursor = 'nw-resize';
    } else if (isMovingOnCorner({ ...param, cornerNum: '2' })) {
      wrapIframeNode.style.cursor = 'ne-resize';
    } else if (isMovingOnCorner({ ...param, cornerNum: '3' })) {
      wrapIframeNode.style.cursor = 'ne-resize';
    } else if (isMovingOnCorner({ ...param, cornerNum: '4' })) {
      wrapIframeNode.style.cursor = 'nw-resize';
    } else if (
      isMovingOnVertical(currentPoint, currentPosition, resizedModal)
    ) {
      wrapIframeNode.style.cursor = 'w-resize';
    } else {
      wrapIframeNode.style.cursor = 's-resize';
    }

    if (!isPressing.current || isUpdatingPosition) return;
    onResizeModal({ x, y });
  }

  function onResizeModal({ x, y }) {
    const positionDiff = onCalculateDiff({ x, y });

    const { direction } = positionDiff;
    let { resizedWidth, resizedHeight } = resizedModal;
    let { x: newX, y: newY } = currentPosition;

    const diffX = x - startPoint.current.x;
    const diffY = y - startPoint.current.y;
    switch (direction) {
      case 'top': {
        resizedHeight += Math.abs(diffY);
        newY += diffY;
        break;
      }
      case 'bottom': {
        resizedHeight += diffY;
        break;
      }
      case 'left': {
        if (resizedWidth >= 100) {
          resizedWidth += Math.abs(diffX);
          newX += diffX;
        }
        break;
      }
      case 'right': {
        if (resizedWidth >= 100) {
          resizedWidth += diffX;
        }
        break;
      }
      default: {
        break;
      }
    }
    console.log('startPoint', isMarkStartPoint.current);
    console.log('resize', direction, resizedWidth, currentPosition.x);
    setResizedModal({ resizedWidth, resizedHeight });
    setCurrentPosition({ x: newX, y: newY });
  }

  function setIsPressing(val) {
    isPressing.current = val;
  }

  return (
    <VideoPlayer
      setIsUpdatingPosition={setIsUpdatingPosition}
      containerRef={containerRef}
      wrapIframeRef={wrapIframeRef}
      resizedModal={resizedModal}
      setIsPressing={setIsPressing}
      onStopPress={onStopPress}
      onDetermineCursor={onDetermineCursor}
      currentPosition={currentPosition}
      isPressing={isPressing.current}
    />
  );
};

export default enhance;
