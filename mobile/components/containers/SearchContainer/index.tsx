import React, { ComponentProps, PropsWithChildren } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { StyledView } from "../../organisms/StyledView.tsx";
import { Link } from "expo-router";
import { YStack } from "tamagui";
import SearchBar from "../../molecules/SearchBar.tsx";

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

  return (
    <SafeAreaView style={styles.container}>
      <Link href={"/search"} asChild disabled={showSearch}>
        <Pressable>
          <SearchBar editable={showSearch} {...props} />
        </Pressable>
      </Link>
      <YStack flexGrow={1}>{children}</YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
