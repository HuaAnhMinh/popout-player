import React, { useState } from 'react';

import { detectDiffOnPull, isMovingOnCorner, isMovingOnVertical } from "../../utils/utils";
import {
    DEFAULT_TOP,
    DEFAULT_LEFT,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
} from "../../utils/constants";

const enhance = (VideoPlayer) => props => {
    const [isUpdatingPosition, setIsUpdatingPosition] = useState(false);
    const [isPressing, setIsPressing] = useState(false);
    const [isMarkStartPoint, setIsMarkStartPoint] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [currentPosition, setCurrentPosition] = useState({ x: DEFAULT_LEFT, y: DEFAULT_TOP });
    const [resizedModal, setResizedModal] = useState({
        resizedWidth: DEFAULT_WIDTH,
        resizedHeight: DEFAULT_HEIGHT
    });
    const [positionDiff, setPositionDiff] = useState({});

    const containerRef = React.createRef();
    const wrapIframeRef = React.createRef();

    const onStopPress = () => {
        if (isUpdatingPosition) {
            setCurrentPosition({ x: currentPosition.x + positionDiff.diffLeft, y: currentPosition.y + positionDiff.diffTop });
        }
        setIsPressing(false);
        setStartPoint(null);
        setIsMarkStartPoint(false);
        setIsUpdatingPosition(false);
    }

    const onCalculateDiff = ({ x, y }) => {
        if (isMarkStartPoint) {
            return detectDiffOnPull(startPoint, { x, y });
        }
        setStartPoint({ x, y });
        setIsMarkStartPoint(true);
    }

    const onDetermineCursor = ({ clientX: x, clientY: y }) => {
        const currentPoint = { x, y };
        const wrapIframeNode = wrapIframeRef.current;
        const param = { currentPoint, currentPosition, resizedModal, cornerNum: '1' };

        if (isMovingOnCorner(param)) {
            wrapIframeNode.style.cursor = 'nw-resize';
        }
        else if (isMovingOnCorner({ ...param, cornerNum: '2' })) {
            wrapIframeNode.style.cursor = 'ne-resize';
        }
        else if (isMovingOnCorner({ ...param, cornerNum: '3' })) {
            wrapIframeNode.style.cursor = 'ne-resize';
        }
        else if (isMovingOnCorner({ ...param, cornerNum: '4' })) {
            wrapIframeNode.style.cursor = 'nw-resize';
        }
        else if (
            isMovingOnVertical(currentPoint, currentPosition, resizedModal)
        ) {
            wrapIframeNode.style.cursor = 'w-resize';
        }
        else {
            wrapIframeNode.style.cursor = 's-resize';
        }
    }

    const onChangePosition = ({ clientX: x, clientY: y }) => {
        const containerNode = containerRef.current;
        const positionDiff = onCalculateDiff({ x, y });

        if (!positionDiff) return;
        setPositionDiff(positionDiff);
        containerNode.style.left = `${currentPosition.x + positionDiff.diffLeft}px`;
        containerNode.style.top = `${currentPosition.y + positionDiff.diffTop}px`;
    }

    const onResizeModal = ({ clientX: x, clientY: y }) => {
        const positionDiff = onCalculateDiff({ x, y });

        if (!positionDiff) return;
        const { diffLeft, diffTop, direction, endPoint } = positionDiff;
        const { resizedWidth, resizedHeight } = resizedModal;
        const wrapIframeNode = wrapIframeRef.current;

        setResizedModal({ ...resizedModal, resizedHeight: resizedHeight + diffTop, resizedWidth: resizedWidth + diffLeft });
    }


    return <VideoPlayer
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
}

export default enhance;