import React, { useState } from 'react';

import { detectUpdatedPosition, isMovingOnCorner, isMovingOnVertical } from "../../utils/utils";
import {
    DEFAULT_TOP,
    DEFAULT_LEFT,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT,
} from "../../utils/constants";

const enhance = (VideoPlayer) => props => {
    const [isPressing, setIsPressing] = useState(false);
    const [isMarkStartPoint, setIsMarkStartPoint] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [currentPosition, setCurrentPosition] = useState({ x: DEFAULT_LEFT, y: DEFAULT_TOP });
    const [resizedModal, setResizedModal] = useState({
        resizedWidth: DEFAULT_WIDTH,
        resizedHeight: DEFAULT_HEIGHT
    });

    const containerRef = React.createRef();
    const wrapIframeRef = React.createRef();

    const onStopPress = () => {
        setStartPoint(null);
        setIsMarkStartPoint(false);
        setIsPressing(false);
    }
    const onChangePosition = ({ clientX: x, clientY: y }) => {
        if (!isPressing) return;

        if (isMarkStartPoint) {
            const { top, left } = detectUpdatedPosition(startPoint, { x, y });
            const containerNode = containerRef.current;

            setCurrentPosition({ x: left, y: top });
            containerNode.style.top = `${top}px`;
            containerNode.style.left = `${left}px`;
            return;
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

    return <VideoPlayer
        containerRef={containerRef}
        wrapIframeRef={wrapIframeRef}
        resizedModal={resizedModal}
        setIsPressing={setIsPressing}
        onChangePosition={onChangePosition}
        onStopPress={onStopPress}
        onDetermineCursor={onDetermineCursor}
    />
}

export default enhance;