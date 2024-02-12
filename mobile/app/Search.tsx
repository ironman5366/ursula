import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import SearchContainer from "../components/SearchContainer";

export default function Search() {
  return (
    <SearchContainer editable>
      <Text>TODO: search page here</Text>
    </SearchContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
