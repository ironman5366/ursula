import { useQuery } from "@tanstack/react-query";
import Volume from "../types/Volume";
import { GOOGLE_BOOKS_API_URL } from "../constants";
import VolumeSearchResponse from "../types/VolumeSearchResponse";

function lookupVolume(isbn: number): Promise<Volume> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_BOOKS_API_URL}?q=isbn:${isbn}`).then((resp) => {
      resp.json().then((data) => {
        let response = data as VolumeSearchResponse;
        if (response.items.length >= 1) {
          resolve(response.items[0]);
        } else {
          // TODO: better error here
          reject();
        }
      });
    });
  });
}

export default function useVolume(isbn: number) {
  const queryKey = ["VOLUME_LOOKUP", isbn];
  return useQuery(queryKey, () => lookupVolume(isbn));
}
