import React from "react";
import { useNavigation } from "expo-router";
import useVolume from "../hooks/useVolume";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import VolumeImage from "../components/atoms/VolumeImage";
import { Text } from "../components/organisms/Themed";
import useInsertReview from "../hooks/useInsertReview";
import useISBNParam from "../hooks/useISBNParam";

export default function BookDetail() {
  const isbn = useISBNParam();
  const { data } = useVolume(isbn);
  const { mutate: review } = useInsertReview();
  const navigation = useNavigation();

  if (data) {
    return (
      <View style={styles.container}>
        <TitleText>{data.volumeInfo.title}</TitleText>
        <VolumeImage volumeInfo={data.volumeInfo} size={250} />
        <Button title={"Add to your list"} />
        <Button
          title="Review"
          onPress={() =>
            // @ts-ignore
            navigation.navigate("Review", {
              isbn: isbn,
            })}
        />
        <Text>{data.volumeInfo.description}</Text>
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
