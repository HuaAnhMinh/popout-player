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
      className="modal__wrap"
      // Update size
      onMouseMove={({ clientX: x, clientY: y }) => onDetermineCursor({ x, y })}
      // End update
      onMouseUp={() => onStopPress()}
    >
      <div className="video__player__modal" ref={containerRef}>
        <span
          className="header"
          // Update position
          onMouseMove={({ clientX: x, clientY: y }) => {
            if (!isPressing) return;
            setIsUpdatingPosition(true);
            onChangePosition({ x, y });
          }}
          // Start update
          onMouseDown={() => setIsPressing(true)}
        ></span>
        <div
          id="wrapIframe"
          ref={wrapIframeRef}
          style={{
            position: "relative",
            height: resizedModal.resizedHeight,
            border: "6px solid #000",
            cursor: "s-resize",
          }}
          // Start update
          onMouseDown={() => setIsPressing(true)}
        >
          <iframe
            width={resizedModal.resizedWidth}
            height={resizedModal.resizedHeight}
            title="video player"
            style={{ borderWidth: "0px" }}
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
            // End update
            onMouseEnter={() => onStopPress()}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default enhance(VideoPlayer);
