import React from "react";

import "./style.css";
import enhance from "./enhance";
import { MIN_WIDTH, MIN_HEIGHT } from "../../utils/constants";

const VideoPlayer = (props) => {
  const {
    url,
    onCloseModal,
    isPressing,
    pointerType,
    frameInfo
  } = props;

  return (
    <div
      className="modal__wrap"
      style={{
        cursor: pointerType,
      }}
    >
      <div
        className="video__player__modal"
        style={{
          top: frameInfo.y,
          left: frameInfo.x,
          cursor: pointerType,
        }}
      >
        <span className="header">
          <div id="close" onClick={() => onCloseModal(false)}></div>
        </span>
        <div
          style={{
            position: "relative",
            border: "6px solid #000",
            cursor: pointerType,
            width: frameInfo.width,
            height: frameInfo.height,
            minWidth: MIN_WIDTH,
            minHeight: MIN_HEIGHT,
          }}
        >
          <iframe
            title="video player"
            style={{
              borderWidth: "0px",
              width: "100%",
              height: "100%",
              pointerEvents: isPressing.current ? "none" : "initial",
              cursor: pointerType !== 'move' ? 'initial' : 'move',
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
