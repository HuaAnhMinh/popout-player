import React, { useEffect, useState } from 'react';
import { detectValues } from "../../utils/utils";
import './style.css';

const VideoPlayer = (props) => {
    const [isPressing, setIsPressing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [markStartPoint, setMarkStartPoint] = useState(true);
    const containerRef = React.createRef();

    const onChangePosition = (event) => {
        if (isPressing) {
            if (markStartPoint) {
                setStartPoint({ x: event.clientX, y: event.clientY });
                setMarkStartPoint(false);
            }
            else {
                const { top, left } = detectValues(startPoint, { x: event.clientX, y: event.clientY });
                const containerNode = containerRef.current;
                containerNode.style.top = `${top}px`;
                containerNode.style.left = `${left}px`;
            }
        } else {
            setStartPoint(null);
            setMarkStartPoint(true);
        }
    }
    return (
        <div className="container" ref={containerRef}>
            <span className="header"
                onMouseMove={(event) => onChangePosition(event)}
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => {
                    setIsPressing(false);
                }}
            >
            </span>
            <div >
                <iframe width="340" height="200" title='video player'
                    src="https://www.youtube.com/embed/tgbNymZ7vqY"
                >
                </iframe>
            </div>
        </div>
    );
}

export default VideoPlayer;


