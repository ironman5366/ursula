import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

export function searchVolumes(query: string): Promise<VolumeSearchResponse> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_BOOKS_API_URL}/?q=${query}`)
      .then(async (resp) => {
        try {
          const data = await resp.json();
          resolve(data as VolumeSearchResponse);
        } catch (err) {
          reject(err);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
