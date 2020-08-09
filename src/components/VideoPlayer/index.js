import React from 'react';

import './style.css';
import enhance from './enhance';

const VideoPlayer = (props) => {
    const {
        containerRef,
        wrapIframeRef,
        resizedModal,
        onStopPress,
        setIsPressing,
        onChangePosition,
        onDetermineCursor
    } = props;

    return (
        <div className="modal_wrap" onMouseUp={onStopPress}>
            <div className="video__player__modal" ref={containerRef}>
                <span className="header"
                    onMouseMove={(event) => onChangePosition(event)}
                    onMouseDown={() => setIsPressing(true)}
                >
                </span>
                <div
                    style={{
                        position: "relative",
                        height: resizedModal.resizedHeight,
                        border: '2px solid #000',
                        cursor: 's-resize'
                    }}
                    onMouseMove={event => onDetermineCursor(event)}
                    ref={wrapIframeRef}
                >
                    <iframe
                        width={resizedModal.resizedWidth}
                        height={resizedModal.resizedHeight}
                        title='video player'
                        style={{ borderWidth: "0px" }}
                        src="https://www.youtube.com/embed/tgbNymZ7vqY"
                    >
                    </iframe>
                </div>
            </div>
        </div>
    );
}

export default enhance(VideoPlayer);


