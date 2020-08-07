import React, { useState } from 'react';

import { detectValues } from "../../utils/utils";
import {
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT
} from "../../utils/constants";

const enhance = (VideoPlayer) => props => {
    const [isPressing, setIsPressing] = useState(false);
    const [isMarkStartPoint, setIsMarkStartPoint] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [resizedWidth, setResizedWidth] = useState(DEFAULT_WIDTH);
    const [resizedHeight, setResizedHeight] = useState(DEFAULT_HEIGHT);
    const containerRef = React.createRef();

    const onStopPress = () => {
        setStartPoint(null);
        setIsMarkStartPoint(false);
        setIsPressing(false);
    }
    const onChangePosition = ({ clientX: x, clientY: y }) => {
        if (!isPressing) return;

        if (isMarkStartPoint) {
            const { top, left } = detectValues(startPoint, { x, y });
            const containerNode = containerRef.current;

            containerNode.style.top = `${top}px`;
            containerNode.style.left = `${left}px`;
            return;
        }
        setStartPoint({ x, y });
        setIsMarkStartPoint(true);
    }

    return <VideoPlayer
        containerRef={containerRef}
        resizedWidth={resizedWidth}
        resizedHeight={resizedHeight}
        setIsPressing={setIsPressing}
        onChangePosition={onChangePosition}
        onStopPress={onStopPress}
    />
}

export default enhance;