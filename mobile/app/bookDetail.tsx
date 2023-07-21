import React from "react";
import Volume from "../types/Volume";
import { useSearchParams } from "expo-router";
import useVolume from "../hooks/useVolume";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import VolumeImage from "../components/atoms/VolumeImage";
import { Text } from "../components/organisms/Themed";
import useReview from "../hooks/useReview";

export default function BookDetail() {
  const params = useSearchParams();
  const isbn: number = Number.parseInt(params.isbn as string);
  const { data, isLoading, isSuccess } = useVolume(isbn);
  const { mutate: review } = useReview();

  if (data) {
    return (
      <View style={styles.container}>
        <TitleText>{data.volumeInfo.title}</TitleText>
        <VolumeImage volumeInfo={data.volumeInfo} size={250} />
        <Button
          title="Review"
          onPress={() =>
            review({
              isbn,
              prevReviewId: null,
            })
          }
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
  subtitle: {},
});
