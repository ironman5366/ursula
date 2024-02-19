import { useState } from "react";

export default function useBinarySearch<T>(items: T[]) {
  const [[start, end], setRange] = useState([0, items.length - 1]);

  if (items.length === 0) {
    return {
      empty: true,
      finished: true,
      curr: null,
      currIdx: 0,
      right: () => {},
      left: () => {},
    };
  }

  const midpoint = Math.floor((start + end) / 2);
  const curr = items[midpoint];
  const finished = start === end;

  return {
    currIdx: midpoint,
    curr,
    right: () => !finished && setRange([midpoint + 1, end]),
    left: () => !finished && setRange([start, midpoint - 1]),
    finished,
    empty: false,
  };
}
