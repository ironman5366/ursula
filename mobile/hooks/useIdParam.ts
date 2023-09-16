import { useLocalSearchParams } from "expo-router";

export default function useIdParam() {
  const params = useLocalSearchParams();
  return Number.parseInt(params.id as string);
}
