import React, { ComponentProps, useEffect, useState } from "react";
import StyledSheet from "../../StyledSheet.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import FinishAddBook from "./FinishAddBook.tsx";
import { FindAddBook } from "./FindAddBook.tsx";

export default function AddBookSheet(
  props: Omit<ComponentProps<typeof StyledSheet>, "children">
) {
  const [selectedBook, selectBook] = useState<Book | null>(null);

  return (
    <StyledSheet {...props}>
      {selectedBook ? (
        <FinishAddBook
          onOpenChange={props.onOpenChange}
          selectBook={selectBook}
          book={selectedBook}
        />
      ) : (
        <FindAddBook
          selectBook={selectBook}
          onOpenChange={props.onOpenChange}
        />
      )}
    </StyledSheet>
  );
}
