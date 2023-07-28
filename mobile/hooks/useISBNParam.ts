import { useLocalSearchParams } from "expo-router";

export default function useISBNParam() {
  const params = useLocalSearchParams();
  return Number.parseInt(params.isbn as string);
}
