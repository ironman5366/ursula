import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";
import { VolumeInfo } from "./types/Volume.ts";

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

export function extractISBN(volumeInfo: VolumeInfo): string | null {
  if (!volumeInfo.industryIdentifiers) {
    return null;
  }

  const isbn_13 = volumeInfo.industryIdentifiers.find(
    (identifier) => identifier.type === "ISBN_13",
  );
  if (isbn_13) {
    return isbn_13.identifier;
  }
  const isbn_10 = volumeInfo.industryIdentifiers.find(
    (identifier) => identifier.type === "ISBN_10",
  );
  if (isbn_10) {
    return isbn_10.identifier;
  }

  return null;
}

export function searchVolumes(name: string): Promise<VolumeSearchResponse> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_BOOKS_API_URL}/?q=${name}`)
      .then((resp) => {
        return resp
          .json()
          .then((data) => {
            resolve(data as VolumeSearchResponse);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
