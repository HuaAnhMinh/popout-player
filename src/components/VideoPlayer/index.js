import React from "react";

import "./style.css";
import enhance from "./enhance";
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../../utils/constants";

const VideoPlayer = (props) => {
  const {
    url,
    onCloseModal,
    isPressing,
    pointerType,
    resizedModal,
    currentPosition,
    onStartPress,
  } = props;

  return (
    <div className="modal__wrap">
      <div
        className="video__player__modal"
        style={{
          top: currentPosition.y,
          left: currentPosition.x,
        }}
        onMouseDown={(e) => onStartPress(e)}
      >
        <span className="header">
          <div id="close" onClick={() => onCloseModal(false)}></div>
        </span>
        <div
          style={{
            position: "relative",
            width: resizedModal.resizedWidth,
            height: resizedModal.resizedHeight,
            // minWidth: DEFAULT_WIDTH,
            // minHeight: DEFAULT_HEIGHT,
            border: "6px solid #000",
            cursor: pointerType,
          }}
        >
          <iframe
            title="video player"
            style={{
              borderWidth: "0px",
              width: "100%",
              height: "100%",
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
