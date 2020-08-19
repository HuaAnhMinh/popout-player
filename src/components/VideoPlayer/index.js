import React from "react";

import "./style.css";
import enhance from "./enhance";

const VideoPlayer = (props) => {
  const {
    url,
    onCloseModal,
    isPressing,
    pointerType,
    resizedModal,
    currentPosition,
    setIsPressing,
    onChangePosition,
    onDetermineCursor,
    setIsUpdatingPosition,
  } = props;

  console.log();
  return (
    <div
      className="modal__wrap"
      // Update size
      onMouseMove={({ clientX: x, clientY: y }) => onDetermineCursor({ x, y })}
    >
      <div
        className="video__player__modal"
        style={{
          top: `${currentPosition.y}px`,
          left: `${currentPosition.x}px`,
        }}
      >
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
        >
          <div id="close" onClick={() => onCloseModal(false)}></div>
        </span>
        <div
          style={{
            position: "relative",
            height: resizedModal.resizedHeight,
            border: "6px solid #000",
            cursor: pointerType,
          }}
          // Start update
          onMouseDown={() => setIsPressing(true)}
        >
          <iframe
            width={resizedModal.resizedWidth}
            height={resizedModal.resizedHeight}
            title="video player"
            style={{
              borderWidth: "0px",
              // minWidth: "340px",
              // minHeight: "200px",
              pointerEvents: isPressing ? "none" : "initial",
            }}
            src={url}
            frameBorder="0"
            scrolling="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default enhance(VideoPlayer);
