import { MIN_HEIGHT, MIN_WIDTH } from "../../utils/constants";

export const resizeTop = (y, lastFramePoint, setFrameInfo) => {
  setFrameInfo((prev) => {
    const height = prev.y + prev.height - y;

    if (height >= MIN_HEIGHT) {
      lastFramePoint.current.y = y;
      return {
        ...prev,
        y,
        height,
      }
    }
    lastFramePoint.current.y = prev.y;
    return prev;
  });
};

export const resizeRight = (x, setFrameInfo) => {
  setFrameInfo((prev) => ({
    ...prev,
    width: x - prev.x >= MIN_WIDTH ? x - prev.x : MIN_WIDTH,
  }));
};

export const resizeBottom = (y, setFrameInfo) => {
  setFrameInfo((prev) => ({
    ...prev,
    height: y - prev.y > MIN_HEIGHT ? y - prev.y : MIN_HEIGHT,
  }));
};

export const resizeLeft = (x, lastFramePoint, setFrameInfo) => {
  setFrameInfo((prev) => {
    const width = prev.x + prev.width - x;

    if (width >= MIN_WIDTH) {
      lastFramePoint.current.x = x;
      return {
        ...prev,
        x,
        width,
      }
    }
    lastFramePoint.current.x = prev.x;
    return prev;
  });
};

export const resizeTopLeft = (x, y, lastFramePoint, setFrameInfo) => {
  setFrameInfo(prev => {
    let width = prev.x + prev.width - x;
    let height = prev.y + prev.height - y;

    if (width < MIN_WIDTH) {
      width = MIN_WIDTH;
      x = prev.x;
    }
    if (height < MIN_HEIGHT) {
      height = MIN_HEIGHT;
      y = prev.y;
    }

    lastFramePoint.current = { x: prev.x, y: prev.y };

    return {
      x,
      y,
      width,
      height,
    };
  });
};

export const resizeTopRight = (x, y, lastFramePoint, setFrameInfo) => {
  setFrameInfo((prev) => {
    let width = x - prev.x;
    let height = prev.y + prev.height - y;

    if (width < MIN_WIDTH) {
      width = MIN_WIDTH;
    }
    if (height < MIN_HEIGHT) {
      height = MIN_HEIGHT;
      y = prev.y;
    }

    lastFramePoint.current.y = prev.y;

    return {
      ...prev,
      y,
      width,
      height,
    };
  });
};

export const resizeBottomRight = (x, y, setFrameInfo) => {
  setFrameInfo((prev) => {
    let width = x - prev.x;
    let height = y - prev.y;

    if (width < MIN_WIDTH) {
      width = MIN_WIDTH
    }
    if (height < MIN_HEIGHT) {
      height = MIN_HEIGHT;
    }

    return {
      ...prev,
      width,
      height,
    };
  });
};

export const resizeBottomLeft = (x, y, lastFramePoint, setFrameInfo) => {
  setFrameInfo((prev) => {
    let width = prev.x + prev.width - x;
    let height = y - prev.y;

    if (width < MIN_WIDTH) {
      width = MIN_WIDTH;
      x = prev.x;
    }
    if (height < MIN_HEIGHT) {
      height = MIN_HEIGHT;
    }

    lastFramePoint.current.x = prev.x;

    return {
      ...prev,
      x,
      width,
      height
    };
  });
};