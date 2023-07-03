import Volume from "../types/Volume";

const GOOGLE_API_URL = "https://googleapis.com/books/v1/volumes/";

interface BookSearchResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}

export default function useSearchBooks(name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_API_URL}/?q=${name}`)
      .then((resp) => {
        resp
          .json()
          .then((data) => {
            resolve(data as BookSearchResponse);
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
