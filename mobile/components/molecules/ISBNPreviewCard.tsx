import React from "react";
import useVolume from "../../hooks/useVolume";
import VolumePreviewCard from "./VolumePreviewCard";

interface Props {
  isbn: number;
}

export default function ISBNPreviewCard({ isbn }: Props) {
  const { data: volume } = useVolume(isbn);

  return <VolumePreviewCard volumeInfo={volume?.volumeInfo} />;
}
