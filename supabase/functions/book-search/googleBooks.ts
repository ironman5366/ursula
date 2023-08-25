import VolumeSearchResponse from "./types/VolumeSearchResponse";

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";



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

