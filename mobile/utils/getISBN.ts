import { VolumeInfo } from "../types/Volume";

export default function getISBN(volumeInfo: VolumeInfo): string {
  const isbn_13 = volumeInfo.industryIdentifiers.find(
    (identifier) => identifier.type === "ISBN_13"
  );
  if (isbn_13) {
    return isbn_13.identifier;
  }
  const isbn_10 = volumeInfo.industryIdentifiers.find(
    (identifier) => identifier.type === "ISBN_10"
  );
  if (isbn_10) {
    return isbn_10.identifier;
  }
  throw new Error("Couldn't find appropriate ISBN on volume");
}
