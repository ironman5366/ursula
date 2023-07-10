import React from "react";
import { VolumeInfo } from "../../types/Volume";
import Card from "../atoms/Card";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../organisms/Themed";
import { useNavigation } from "expo-router";
import getISBN from "../../utils/getISBN";
import VolumeImage from "../atoms/VolumeImage";

export interface VolumePreviewCardProps {
  volumeInfo: VolumeInfo;
}

export default function VolumePreviewCard({
  volumeInfo,
}: VolumePreviewCardProps) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        // @ts-ignore
        navigation.navigate("bookDetail", {
          isbn: getISBN(volumeInfo),
        })
      }
    >
      <Card style={styles.container}>
        <View style={styles.imageContainer}>
          <VolumeImage volumeInfo={volumeInfo} size={50} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{volumeInfo.title}</Text>
          {volumeInfo.authors && (
            <Text style={styles.subtitle}>{volumeInfo.authors.join(", ")}</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: 100,
    justifyContent: "center",
    padding: 5,
  },
  imageContainer: {
    paddingRight: 5,
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
