import { useLocalSearchParams } from "expo-router";

function coerceId(id: string | string[]): number {
  if (Array.isArray(id)) {
    return Number.parseInt(id[0]);
  }
  return Number.parseInt(id);
}

export default function useIdParam() {
  const { id } = useLocalSearchParams();
  return coerceId(id);
}
