import { DEFAULT_TOP, DEFAULT_LEFT } from "./constants";

export const vailidateUrl = (url) => {
    return true;
}

export const detectValues = (start, end) => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y

    // if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
    //     return { top: DEFAULT_TOP, left: DEFAULT_LEFT + deltaX };
    // } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
    //     return { top: DEFAULT_TOP, left: DEFAULT_LEFT + deltaX };
    // } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
    //     return { top: DEFAULT_TOP + deltaY, left: DEFAULT_LEFT };
    // } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
    //     return { top: DEFAULT_TOP + deltaY, left: DEFAULT_LEFT };
    // }

    return { top: DEFAULT_TOP + deltaY, left: DEFAULT_LEFT + deltaX }
}