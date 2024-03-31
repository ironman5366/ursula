import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import useRecentlyJoined from "../../hooks/useRecentlyJoined.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { YStack } from "tamagui";
import SearchBar from "../../components/molecules/SearchBar.tsx";
import { FlatList } from "react-native";
import useDebounce from "../../hooks/useDebounce.ts";
import useSearch from "../../hooks/useSearch.ts";
import FollowProfileItem from "./FollowProfileItem.tsx";

interface Props {
  follows: string[];
  setFollows: Dispatch<SetStateAction<string[]>>;
}

export default function FollowProfileSearch({ follows, setFollows }: Props) {
  const { data: profiles, isLoading } = useRecentlyJoined();
  const [displayedProfiles, setDisplayedProfiles] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const debounced = useDebounce(searchInput, 500);

  const { data: searchResults, isLoading: isSearchLoading } = useSearch({
    query: debounced,
    enabled: !!debounced,
    filter: (result) => result.entity_type === "profiles",
  });

  // If there's an active search, we'll show the search results
  // (even if there aren't any), or otherwise we'll show users who have
  // recently joined
  useEffect(() => {
    if (debounced) {
      if (Array.isArray(searchResults)) {
        setDisplayedProfiles(searchResults.map((r) => r.entity_id_uuid));
      }
    } else {
      if (Array.isArray(profiles)) {
        setDisplayedProfiles(profiles.map((p) => p.id));
      }
    }
  }, [searchResults, profiles, debounced]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <YStack>
      <SearchBar
        editable
        value={searchInput}
        onChangeText={(val) => setSearchInput(val)}
      />
      <FlatList
        data={displayedProfiles}
        renderItem={({ item, index }) => (
          <FollowProfileItem
            profileId={item}
            key={index}
            follows={follows}
            setFollows={setFollows}
          />
        )}
      />
    </YStack>
  );
}
