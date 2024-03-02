import React, { PropsWithChildren } from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";

export default function DismissKeyboardContainer(props: PropsWithChildren<{}>) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {props.children}
    </TouchableWithoutFeedback>
  );
}
