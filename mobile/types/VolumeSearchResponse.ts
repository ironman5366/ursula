import Volume from "./Volume";

export default interface VolumeSearchResponse {
  kind: string;
  totalItems: number;
  items: Volume[];
}
