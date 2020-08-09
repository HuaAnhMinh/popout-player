import React, { useState } from 'react';

import { detectUpdatedPosition } from "../../utils/utils";
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
        const { x: x1, y: y1 } = currentPosition;
        const { resizedWidth, resizedHeight } = resizedModal

        const movingPoint = { x, y };
        const edg_1 = { x: x1, y: y1 }
        const edg_2 = { x: x1 + resizedWidth, y: y1 };
        const edg_3 = { x: x1, y: y1 + resizedHeight }
        const edg_4 = { x: x1 + resizedWidth, y: y1 + resizedHeight };
        const wrapIframeNode = wrapIframeRef.current;

        if (JSON.stringify(movingPoint) === JSON.stringify(edg_1)) {
            wrapIframeNode.style.cursor = 'nw-resize';
        }
        else if (JSON.stringify(movingPoint) === JSON.stringify(edg_2)) {
            wrapIframeNode.style.cursor = 'ne-resize';

        }
        else if (JSON.stringify(movingPoint) === JSON.stringify(edg_3)) {
            wrapIframeNode.style.cursor = 'ne-resize';

        }
        else if (JSON.stringify(movingPoint) === JSON.stringify(edg_4)) {
            wrapIframeNode.style.cursor = 'nw-resize';
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