import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "../components/organisms/Themed";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useRankedReviews from "../hooks/useRankedReviews";
import useVolume from "../hooks/useVolume";
import VolumePreviewCard from "../components/molecules/VolumePreviewCard";

export default function Review() {
  const params = useLocalSearchParams();
  const isbn: number = Number.parseInt(params.isbn as string);
  const { data: volumeData } = useVolume(isbn);
  const { data, isLoading } = useRankedReviews();
  const [comparatorIdx, setComparatorIdx] = useState<number>();
  const comparator = useMemo(() => {
    if (comparatorIdx !== undefined && data?.data) {
      return data.data[comparatorIdx];
    }
  }, [comparatorIdx, data]);
  const comparatorVolume = useVolume(comparator?.isbn);

  useEffect(() => {
    if (data?.data) {
      const midpoint = data.data.length;
      const idx = Math.floor(midpoint / 2);
      console.log("Setting comparator idx to ", idx, "data is ", data.data);
      setComparatorIdx(idx);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>Which book did you prefer?</Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: 400,
        }}
      >
        <VolumePreviewCard volumeInfo={volumeData?.volumeInfo} />
        <VolumePreviewCard volumeInfo={comparatorVolume?.data?.volumeInfo} />
      </View>
    </View>
  );
}
