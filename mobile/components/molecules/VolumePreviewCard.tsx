import React from "react";
import { VolumeInfo } from "../../types/Volume";
import Card from "../atoms/Card";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../organisms/Themed";
import { useNavigation } from "expo-router";
import { getISBN } from "../../utils/isbn";
import VolumeImage from "../atoms/VolumeImage";

export interface VolumePreviewCardProps {
  volumeInfo: VolumeInfo | undefined;
}

export default function VolumePreviewCard({
  volumeInfo,
}: VolumePreviewCardProps) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={!volumeInfo}
      onPress={() => {
        if (volumeInfo) {
          // @ts-ignore
          navigation.navigate("bookDetail", {
            isbn: getISBN(volumeInfo),
          });
        }
      }}
    >
      <Card style={styles.container}>
        {volumeInfo ? (
          <>
            <View style={styles.imageContainer}>
              <VolumeImage volumeInfo={volumeInfo} size={50} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{volumeInfo.title}</Text>
              {volumeInfo.authors && (
                <Text style={styles.subtitle}>
                  {volumeInfo.authors.join(", ")}
                </Text>
              )}
            </View>
          </>
        ) : (
          <ActivityIndicator />
        )}
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
