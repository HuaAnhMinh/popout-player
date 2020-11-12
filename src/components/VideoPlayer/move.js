export const moveModal = (x, y, pressedPoint, lastFramePoint, setFrameInfo) => {
  const diffX = x - pressedPoint.current.x;
  const diffY = y - pressedPoint.current.y;

  setFrameInfo(prev => {
    const x = pressedPoint.current.frameX + diffX;
    const y = pressedPoint.current.frameY + diffY;

    lastFramePoint.current = { x, y, };

    return {
      ...prev,
      x,
      y,
    };
  });
};