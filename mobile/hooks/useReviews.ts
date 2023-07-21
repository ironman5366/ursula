import Ranking from "../types/Ranking";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { REVIEWS_TABLE } from "../constants";

function retrieveRankings(): Promise<Ranking[]> {
  return new Promise((resolve, reject) => {
    supabase
      .from(REVIEWS_TABLE)
      .select()
      .then((data) => resolve(data));
  });
}

export default function useReviews() {
  return useQuery(["REVIEW_LOOKUP"], retrieveRankings);
}