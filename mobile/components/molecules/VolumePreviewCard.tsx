import React from "react";
import { VolumeInfo } from "../../types/Volume";
import Card from "../atoms/Card";
import { Image, StyleSheet } from "react-native";
import { Text, View } from "../organisms/Themed";

export interface VolumePreviewCardProps {
  volumeInfo: VolumeInfo;
}

export default function VolumePreviewCard({
  volumeInfo,
}: VolumePreviewCardProps) {
  const thumbnailLink = volumeInfo.imageLinks.smallThumbnail;
  return (
    <Card style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={{
            height: 50,
            width: 50,
          }}
          source={{
            uri: thumbnailLink,
          }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{volumeInfo.title}</Text>
        <Text style={styles.subtitle}>{volumeInfo.authors.join(", ")}</Text>
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
