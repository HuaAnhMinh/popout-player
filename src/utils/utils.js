import { DEFAULT_CORNER_RADIUS } from "./constants";

export const vailidateUrl = (url) => {
  return true;
};

export const detectDiffOnPull = (start, end) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  let direction;

  if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
    direction = "right";
  } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
    direction = "left";
  } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
    direction = "bottom";
  } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
    direction = "top";
  }

  return { diffLeft: deltaX, diffTop: deltaY, direction };
};

export const isMovingOnCorner = ({
  currentPoint,
  currentPosition,
  resizedModal,
  cornerNum,
}) => {
  let corner;
  const { x: x1, y: y1 } = currentPosition;
  const { resizedWidth, resizedHeight } = resizedModal;

  switch (cornerNum) {
    case "1":
      corner = { x: x1, y: y1 };
      break;
    case "2":
      corner = { x: x1 + resizedWidth, y: y1 };
      break;
    case "3":
      corner = { x: x1, y: y1 + resizedHeight };
      break;
    case "4":
      corner = { x: x1 + resizedWidth, y: y1 + resizedHeight };
      break;
    default:
      corner = { x: x1, y: y1 };
  }
  const distance = Math.sqrt(
    Math.pow(currentPoint.x - corner.x, 2) +
      Math.pow(currentPoint.y - corner.y, 2)
  );
  if (distance < DEFAULT_CORNER_RADIUS) return true;
  return false;
};

export const isMovingOnVerticalCalculate = (
  currentPoint,
  verticalEdge,
  horizontalEdge,
  resizedHeight
) => {
  const d1 = Math.sqrt(
    Math.pow(currentPoint.x - verticalEdge.x, 2) +
      Math.pow(currentPoint.y - verticalEdge.y, 2)
  );
  const d2 = Math.sqrt(
    Math.pow(currentPoint.x - horizontalEdge.x, 2) +
      Math.pow(currentPoint.y - horizontalEdge.y, 2)
  );

  if (d1 < d2) {
    if (d1 < (resizedHeight - 2 * DEFAULT_CORNER_RADIUS) / 2) return true;
    return false;
  } else {
    return false;
  }
};

export const isMovingOnVertical = (
  currentPoint,
  currentPosition,
  resizedModal
) => {
  const { x: x1, y: y1 } = currentPosition;
  const { resizedWidth, resizedHeight } = resizedModal;

  if (
    isMovingOnVerticalCalculate(
      currentPoint,
      { x: x1, y: y1 + resizedHeight / 2 },
      { x: x1 + resizedWidth / 2, y: y1 },
      resizedHeight
    )
  ) {
    return true;
  } else {
    if (
      isMovingOnVerticalCalculate(
        currentPoint,
        { x: x1, y: y1 + resizedHeight / 2 },
        { x: x1 + resizedWidth / 2, y: y1 + resizedHeight },
        resizedHeight
      )
    ) {
      return true;
    } else {
      if (
        isMovingOnVerticalCalculate(
          currentPoint,
          { x: x1 + resizedWidth, y: y1 + resizedHeight / 2 },
          { x: x1 + resizedWidth / 2, y: y1 },
          resizedHeight
        )
      ) {
        return true;
      } else {
        if (
          isMovingOnVerticalCalculate(
            currentPoint,
            { x: x1 + resizedHeight, y: y1 + resizedHeight / 2 },
            { x: x1 + resizedWidth / 2, y: y1 + resizedHeight },
            resizedHeight
          )
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
};

export const detectNewsize = (currentPoint, positionDiff) => {};
