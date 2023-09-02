import Volume from "./Volume.ts";

export default interface VolumeSearchResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}
