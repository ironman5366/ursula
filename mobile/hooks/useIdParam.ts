import { useLocalSearchParams } from "expo-router";

function coerceId(id: string | string[]): number {
  if (Array.isArray(id)) {
    return Number.parseInt(id[0]);
  }
  return Number.parseInt(id);
}

export default function useNumericIdParam() {
  const { id } = useLocalSearchParams();
  return coerceId(id);
}

export function useStringIdParam() {
  const { id } = useLocalSearchParams();
  if (Array.isArray(id)) {
    return id[0];
  }
  return id;
}
