import { useState } from "react";

interface BinarySearchResults<T> {
  currIdx: number;
  curr: T;

  right: () => void;
  left: () => void;
}

interface BinarySearchParams<T> {
  items: T[];
  onFinished: (idx: number) => void;
}

export default function useBinarySearch<T>({
  items,
  onFinished,
}: BinarySearchParams<T>): BinarySearchResults<T> {
  const [[start, end], setRange] = useState([0, items.length - 1]);

  const midpoint = Math.floor((start + end) / 2);
  const curr = items[midpoint];
  const last = start === end;

  if (last) {
    return {
      currIdx: midpoint,
      curr,
      right: () => {
        onFinished(midpoint + 1);
      },
      left: () => {
        onFinished(midpoint);
      },
    };
  } else {
    return {
      currIdx: midpoint,
      curr,
      right: () => {
        const newStart = Math.min(midpoint + 1, end);
        setRange([newStart, end]);
      },
      left: () => {
        const newEnd = Math.max(midpoint - 1, start);
        setRange([start, newEnd]);
      },
    };
  }
}
