import React from "react";
import { SearchResult } from "@ursula/shared-types/SearchResult.ts";
import SearchResultItem from "../../components/organisms/SearchResultList/SearchResultItem.tsx";

export type SearchFilter = (result: SearchResult) => boolean;

interface Props {
  title: string;
  results: SearchResult[];
}

const SECTIONS = {
  books: [],
};

export default function SearchTab({ title, results }: Props) {}
