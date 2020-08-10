import React from 'react';

import './style.css';
import enhance from './enhance';

const VideoPlayer = (props) => {
    const {
        containerRef,
        isUpdatingPosition,
        isPressing,
        wrapIframeRef,
        resizedModal,
        onStopPress,
        setIsPressing,
        onChangePosition,
        onDetermineCursor,
        onResizeModal,
        setIsUpdatingPosition
    } = props;

    return (
        <div
            className="modal_wrap"
            onMouseUp={() => {
                onStopPress();
            }}
            onMouseMove={event => onDetermineCursor(event)}
            id="modal_wrap"
        >
            <div
                className="video__player__modal"
                ref={containerRef}
                onMouseMove={(event) => {
                    if (!isPressing || isUpdatingPosition) return;
                    onResizeModal(event);
                }}
                onMouseDown={() => setIsPressing(true)}
            >
                <span
                    className="header"
                    onMouseMove={(event) => {
                        if (!isPressing) return;
                        setIsUpdatingPosition(true);
                        onChangePosition(event);
                    }}
                    onMouseDown={() => {
                        setIsPressing(true);
                    }}
                >
                </span>
                <div
                    style={{
                        position: "relative",
                        height: resizedModal.resizedHeight,
                        border: '2px solid #000',
                        cursor: 's-resize'
                    }}
                    ref={wrapIframeRef}
                >
                    <iframe
                        width={resizedModal.resizedWidth}
                        height={resizedModal.resizedHeight}
                        title='video player'
                        style={{ borderWidth: "0px" }}
                        src="https://www.youtube.com/embed/tgbNymZ7vqY"
                        onMouseUp={() => {
                            console.log('------iframe--on stop press----');
                            onStopPress();
                        }}
                    >
                    </iframe>
                </div>
            </div>
        </div>
    );
}

export default enhance(VideoPlayer);


