import React from "react";
import Volume from "../types/Volume";
import { useSearchParams } from "expo-router";
import useVolume from "../hooks/useVolume";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { TitleText } from "../components/atoms/TitleText";
import VolumeImage from "../components/atoms/VolumeImage";
import { Text } from "../components/organisms/Themed";

export interface BookDetailProps {
  volume: Volume;
}

export default function BookDetail(props: BookDetailProps) {
  const params = useSearchParams();
  const isbn: string = params.isbn as string;
  const { data, isLoading, isSuccess } = useVolume(isbn);

  if (data) {
    return (
      <View style={styles.container}>
        <TitleText>{data.volumeInfo.title}</TitleText>
        <VolumeImage volumeInfo={data.volumeInfo} size={250} />

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
