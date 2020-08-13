import React from "react";

import "./style.css";
import enhance from "./enhance";

const VideoPlayer = (props) => {
  const {
    isPressing,
    containerRef,
    wrapIframeRef,
    resizedModal,
    onStopPress,
    setIsPressing,
    onChangePosition,
    onDetermineCursor,
    setIsUpdatingPosition,
  } = props;

  return (
    <div
      className="modal_wrap"
      onMouseUp={() => {
        onStopPress();
      }}
      // Update size
      onMouseMove={(event) => onDetermineCursor(event)}
      onMouseEnter={() => onStopPress()}
    >
      <div className="video__player__modal" ref={containerRef}>
        <span
          className="header"
          // Update position
          onMouseMove={(event) => {
            if (!isPressing) return;
            setIsUpdatingPosition(true);
            onChangePosition(event);
          }}
          onMouseDown={() => setIsPressing(true)}
        ></span>
        <div
          id="wrapIframe"
          style={{
            position: "relative",
            height: resizedModal.resizedHeight,
            border: "6px solid #000",
            cursor: "s-resize",
          }}
          ref={wrapIframeRef}
          onMouseDown={() => setIsPressing(true)}
        >
          <iframe
            width={resizedModal.resizedWidth}
            height={resizedModal.resizedHeight}
            title="video player"
            style={{ borderWidth: "0px" }}
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
            onMouseEnter={() => {
              onStopPress();
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default enhance(VideoPlayer);
