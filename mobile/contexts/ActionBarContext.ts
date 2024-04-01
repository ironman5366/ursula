import { useState } from "react";
import constate from "constate";

export const [ActionBarProvider, useActionBarContext] = constate(() => {
  const [actionBarVisible, setActionBarVisible] = useState(true);

  return {
    actionBarVisible,
    setActionBarVisible,
  };
});
