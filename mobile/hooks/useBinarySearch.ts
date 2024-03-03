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

  console.log(
    "items",
    items.map((i) => i.book.name!)
  );

  const midpoint = Math.floor((start + end) / 2);
  const curr = items[midpoint];
  const finished = start === end;

  console.log(
    "midpoint",
    midpoint,
    "start",
    start,
    "end",
    end,
    "finished",
    finished,
    "items.length",
    items.length
  );

  return {
    currIdx: midpoint,
    curr,
    right: () => {
      const newStart = Math.min(midpoint + 1, end);
      !finished && setRange([newStart, end]);
    },
    left: () => {
      const newEnd = Math.max(midpoint - 1, end);
      !finished && setRange([start, Math.min(start, newEnd)]);
    },
    finished,
    empty: false,
  };
}
