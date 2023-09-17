import React from "react";
import { useNavigation } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import BookImage from "../components/atoms/BookImage";
import { Text } from "../components/organisms/Themed";
import useInsertReview from "../hooks/useInsertReview";
import useIdParam from "../hooks/useIdParam";
import useBook from "../hooks/useBook";

export default function BookDetail() {
  const id = useIdParam();
  const { data } = useBook(id);
  const { mutate: review } = useInsertReview();
  const navigation = useNavigation();

  if (data) {
    return (
      <View style={styles.container}>
        <TitleText>{data.title}</TitleText>
        <BookImage book={data} size={250} />
        <Button title={"Add to your list"} />
        <Button
          title="Review"
          onPress={() =>
            // @ts-ignore
            navigation.navigate("Review", {
              id,
            })}
        />
        {
          // TODO: store description in DB, display here
        }
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  subtitle: {},
});
