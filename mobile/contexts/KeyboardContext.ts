import constate from "constate";
import { useState, useEffect } from "react";
import { Keyboard } from "react-native";

export const [KeyboardProvider, useKeyboardUp] = constate(() => {
  const [keyboardUp, setKeyboardUp] = useState(false);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboardUp(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboardUp(false));
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return keyboardUp;
});
