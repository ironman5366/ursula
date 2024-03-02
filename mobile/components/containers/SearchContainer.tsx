import React, { ComponentProps, PropsWithChildren } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { StyledView } from "../organisms/StyledView.tsx";
import SearchBar from "../atoms/SearchBar.tsx";
import { Link } from "expo-router";

function SearchNavigator({
  children,
  style,
}: PropsWithChildren<{ style: StyleProp<ViewStyle> }>) {
  return (
    <Link href={"/search"} asChild>
      <Pressable>
        <StyledView style={style}>{children}</StyledView>
      </Pressable>
    </Link>
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
  const showSearch = "editable" in props && props.editable;
  const WrapperComp = showSearch ? StyledView : SearchNavigator;

  return (
    <SafeAreaView style={styles.container}>
      <WrapperComp style={styles.searchBarContainer}>
        <SearchBar {...props} />
      </WrapperComp>
      <StyledView style={styles.children}>{children}</StyledView>
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
