import { BookChoice, CHOOSE_BOOK_FUNCTION, chooseBook } from "./chooseBook.tsx";
import { ReactElement } from "react";

export type FunctionRenderProps<I, R> = {
  input: I;
  result: R;
};

export type FunctionBinding<I, R> = {
  invoke: (input: I) => Promise<R>;
  render?: (props: FunctionRenderProps<I, R>) => ReactElement;
};

export const FUNCTION_BINDINGS = {
  [CHOOSE_BOOK_FUNCTION.name]: {
    invoke: chooseBook,
    render: BookChoice,
  },
};
