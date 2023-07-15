import Ranking from "../types/Ranking";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { RANKINGS_TABLE } from "../constants";

function retrieveRankings(): Promise<Ranking[]> {
  return new Promise((resolve, reject) => {
    supabase
      .from(RANKINGS_TABLE)
      .select()
      .then((data) => resolve(data));
  });
}

export default function useRankings() {
  return useQuery(["RANKING_LOOKUP"], retrieveRankings);
}
