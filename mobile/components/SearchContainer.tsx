import React, { ComponentProps, PropsWithChildren } from "react";
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { View } from "./organisms/Themed";
import SearchBar from "./atoms/SearchBar";
import { useNavigation } from "expo-router";

function SearchNavigator({
  children,
  style,
}: PropsWithChildren<{ style: StyleProp<ViewStyle> }>) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      // TODO: can I fix the typechecker with these navigate calls?
      // @ts-ignore
      onPress={() => navigation.navigate("Search")}
    >
      <View style={style}>{children}</View>
    </TouchableOpacity>
  );
}

type Props =
  | {
      editable: false;
    }
  | {}
  | ({
      editable: true;
    } & ComponentProps<typeof SearchBar>);

export default function SearchContainer({
  children,
  ...props
}: PropsWithChildren<Props>) {
  const navigation = useNavigation();
  const showSearch = "editable" in props && props.editable;
  const WrapperComp = showSearch ? View : SearchNavigator;

  return (
    <SafeAreaView style={styles.container}>
      <WrapperComp style={styles.searchBarContainer}>
        <SearchBar {...props} />
      </WrapperComp>
      <View style={styles.children}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
  },
  children: {
    flex: 1,
    padding: 10,
  },
});
