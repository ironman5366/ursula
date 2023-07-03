import { Text, TextProps } from "../organisms/Themed";
import { StyleSheet } from "react-native";

export function TitleText(props: TextProps) {
  return <Text {...props} style={[props.style, styles.title]}></Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
});
