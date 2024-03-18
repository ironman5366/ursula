import React, { ReactElement } from "react";
import { ActivityIndicator } from "react-native";
import { ListItem, XStack } from "tamagui";

interface Props<T> {
  icon: ReactElement;
  elem: T | null | undefined;
  render: (elem: T) => ReactElement;
}

export default function LoaderRow<T>({ icon, elem, render }: Props<T>) {
  if (elem) {
    return render(elem);
  } else {
    return (
      <ListItem icon={icon}>
        <ActivityIndicator size={"small"} />
      </ListItem>
    );
  }
}
