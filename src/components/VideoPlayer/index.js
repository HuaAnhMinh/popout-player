import React from 'react';

import {
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT
} from "../../utils/constants";
import './style.css';
import enhance from './enhance';

const VideoPlayer = (props) => {
    const {
        containerRef,
        resizedWidth,
        resizedHeight,
        onStopPress,
        setIsPressing,
        onChangePosition
    } = props;

    return (
        <div className="modal_wrap" onMouseUp={onStopPress}>
            <div className="video__player__modal" ref={containerRef}>
                <span className="header"
                    onMouseMove={(event) => onChangePosition(event)}
                    onMouseDown={() => setIsPressing(true)}
                >
                </span>
                <div style={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}>
                    <iframe width={resizedWidth} height={resizedHeight} title='video player'
                        src="https://www.youtube.com/embed/tgbNymZ7vqY"
                    >
                    </iframe>
                </div>
            </div>
        </div>
    );
}

export default enhance(VideoPlayer);


