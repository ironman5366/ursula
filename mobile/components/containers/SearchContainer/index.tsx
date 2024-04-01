import React, { ComponentProps, PropsWithChildren } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { StyledView } from "../../organisms/StyledView.tsx";
import { Link } from "expo-router";
import { YStack } from "tamagui";
import SearchBar from "../../molecules/SearchBar.tsx";

function SearchNavigator({ children, style }: PropsWithChildren<any>) {
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
      <WrapperComp>
        <SearchBar editable={showSearch} {...props} />
      </WrapperComp>
      <YStack flexGrow={1}>{children}</YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
