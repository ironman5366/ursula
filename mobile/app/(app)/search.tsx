import SearchPage from "../../pages/Search";
import { useLocalSearchParams } from "expo-router";

export default function Search() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  return <SearchPage initialQuery={query} />;
}
