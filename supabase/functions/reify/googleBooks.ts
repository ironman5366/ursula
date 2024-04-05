export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

export interface IndustryIdentifier {
  type: "ISBN_13" | "ISBN_10";
  identifier: string;
}

export interface VolumeInfo {
  title: string;
  subtitle: string;
  authors?: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  industryIdentifiers?: IndustryIdentifier[];
  readingModes: {
    text: boolean;
    image: boolean;
  };
  pageCount: number;
  printType: string;
  categories: string[];
  // TODO: maybe can be an enum
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: {
    containsEpubBubbles: boolean;
    containsImageBubbles: boolean;
  };
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
  // TODO: flesh out these object types
  saleInfo: object;
  accessInfo: object;
}

export default interface Volume {
  kind: "books#volume";
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
}

export interface VolumeSearchResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}

export function findVolume(isbn: number): Promise<VolumeSearchResponse> {
  return new Promise((resolve, reject) => {
    fetch(`${GOOGLE_BOOKS_API_URL}/?q=isbn:${isbn}`)
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
