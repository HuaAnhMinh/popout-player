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
      style={{
        cursor: pointerType,
      }}
      id="page-wrapper"
    >
      <div
        id="modal-wrapper"
        style={{
          top: frameInfo.y,
          left: frameInfo.x,
          cursor: pointerType,
          width: frameInfo.width + 14,
          height: frameInfo.height + 14,
          minWidth: MIN_WIDTH,
          minHeight: MIN_HEIGHT,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            className="outside-boundary corner"
            id="outside-top-left"
            style={{ cursor: !isPressing ? 'nwse-resize' : 'default' }}
          />

          <div
            className="outside-boundary"
            id="top"
            style={{ width: frameInfo.width, cursor: !isPressing ? 'ns-resize' : 'default' }}
          />

          <div
            className="outside-boundary corner"
            id="outside-top-right"
            style={{ cursor: !isPressing ? 'nesw-resize' : 'default' }}
          />
        </div>

        <div style={{ display: 'flex' }}>

          <div
            className="outside-boundary"
            id="left"
            style={{ cursor: !isPressing ? 'ew-resize' : 'default' }}
          />
          
          <div>
            <div
              id="move-overlay"
              style={{ width: frameInfo.width, cursor: !isPressing ? 'move' : 'default' }}
            >
              <div id="move-overlay__content" onClick={() => onCloseModal(false)}>✖</div>
            </div>

            <div
              id="video-player-modal"
              style={{
                cursor: pointerType,
                width: frameInfo.width,
                height: frameInfo.height,
                minWidth: MIN_WIDTH,
                minHeight: MIN_HEIGHT,
              }}
            >
              <div className="inside-boundary-wrapper">
                <div
                  className="inside-boundary corner"
                  id="inside-top-left"
                  style={{ cursor: !isPressing ? 'nwse-resize' : 'default' }}
                />

                <div
                  className="inside-boundary corner"
                  id="inside-top-right"
                  style={{ cursor: !isPressing ? 'nesw-resize' : 'default' }}
                />
              </div>

              <div id="resize-overlay" style={{ cursor: pointerType }} />

              <iframe
                title="video player"
                id="iframe-video-player"
                style={{
                  borderWidth: "0px",
                  width: frameInfo.width,
                  height: frameInfo.height,
                  minWidth: MIN_WIDTH,
                  minHeight: MIN_HEIGHT,
                }}
                src={url}
                frameBorder="0"
                scrolling="0"
              >
              </iframe>

              <div className="inside-boundary-wrapper inside-boundary-wrapper--bottom">
                <div
                  className="inside-boundary corner"
                  id="inside-bottom-left"
                  style={{ cursor: !isPressing ? 'nesw-resize' : 'default' }}
                />
                <div
                  className="inside-boundary corner"
                  id="inside-bottom-right"
                  style={{ cursor: !isPressing ? 'nwse-resize' : 'default' }}
                />
              </div>
            </div>
          </div>

          <div
            className="outside-boundary"
            id="right"
            style={{ cursor: !isPressing ? 'ew-resize' : 'default' }}
          />
        </div>

        <div style={{ display: 'flex' }}>
          <div
            className="outside-boundary corner"
            id="outside-bottom-left"
            style={{ cursor: !isPressing ? 'nesw-resize' : 'default' }}
          />
          <div
            className="outside-boundary"
            id="bottom"
            style={{ width: frameInfo.width, cursor: !isPressing ? 'ns-resize' : 'default' }}
          />
          <div
            className="outside-boundary corner"
            id="outside-bottom-right"
            style={{ cursor: !isPressing ? 'nwse-resize' : 'default' }}
          />
        </div>
      </div>
    </div>
  );
};

export default enhance(VideoPlayer);
