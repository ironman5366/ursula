import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GOOGLE_BOOKS_API_URL } from "../constants/Urls";
import VolumeSearchResponse from "../types/VolumeSearchResponse";

function searchVolumes(name: string): Promise<VolumeSearchResponse> {
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

export default function useSearchVolumes(name: string, enabled: boolean) {
  const queryKey = useMemo(() => ["VOLUME_SEARCH", name], [name]);
  return useQuery(queryKey, () => searchVolumes(name), { enabled });
}
