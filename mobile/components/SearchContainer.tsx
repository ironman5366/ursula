import React, { ComponentProps, PropsWithChildren } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { ThemedView } from "./organisms/Themed";
import SearchBar from "./atoms/SearchBar";
import { Link, useNavigation } from "expo-router";

function SearchNavigator({
  children,
  style,
}: PropsWithChildren<{ style: StyleProp<ViewStyle> }>) {
  const navigation = useNavigation();
  return (
    <Link href={"/search"} asChild>
      <Pressable>
        <ThemedView style={style}>{children}</ThemedView>
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
  const WrapperComp = showSearch ? ThemedView : SearchNavigator;

  return (
    <SafeAreaView style={styles.container}>
      <WrapperComp style={styles.searchBarContainer}>
        <SearchBar {...props} />
      </WrapperComp>
      <ThemedView style={styles.children}>{children}</ThemedView>
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
