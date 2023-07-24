import React from "react";
import useVolume from "../../hooks/useVolume";
import VolumePreviewCard, {
  VolumePreviewCardProps,
} from "../molecules/VolumePreviewCard";

interface Props extends Omit<VolumePreviewCardProps, "volumeInfo"> {
  isbn: number;
}

export default function ISBNPreviewCard({ isbn, ...rest }: Props) {
  const { data: volume } = useVolume(isbn);

  return <VolumePreviewCard volumeInfo={volume?.volumeInfo} {...rest} />;
}
