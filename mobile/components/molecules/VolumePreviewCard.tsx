import React from "react";
import { VolumeInfo } from "../../types/Volume";
import Card from "../atoms/Card";
import { Image, StyleSheet } from "react-native";
import { Text, View } from "../organisms/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface VolumePreviewCardProps {
  volumeInfo: VolumeInfo;
}

export default function VolumePreviewCard({
  volumeInfo,
}: VolumePreviewCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.imageContainer}>
        {volumeInfo.imageLinks ? (
          <Image
            style={{
              height: 50,
              width: 50,
            }}
            source={{
              uri: volumeInfo.imageLinks.thumbnail,
            }}
          />
        ) : (
          <Ionicons name={"image"} size={50} />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{volumeInfo.title}</Text>
        {volumeInfo.authors && (
          <Text style={styles.subtitle}>{volumeInfo.authors.join(", ")}</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  imageContainer: {
    width: 50,
    height: 100,
  },
  textContainer: {
    width: 200,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
  },
});
