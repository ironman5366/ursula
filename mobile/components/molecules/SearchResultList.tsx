import React from "react";
import Volume from "../../types/Volume";
import { FlatList } from "react-native";
import VolumePreviewCard from "./VolumePreviewCard";

export interface SearchResultListProps {
  volumes: Volume[];
}

export default function SearchResultList({ volumes }: SearchResultListProps) {
  return (
    <FlatList
      data={volumes}
      renderItem={(item) => (
        <VolumePreviewCard volumeInfo={item.item.volumeInfo} />
      )}
    />
  );
}
