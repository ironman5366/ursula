import { useMutation } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { RANKINGS_TABLE } from "../constants";

interface NewRanking {
  isbn: number;
  prevRankId: number;
}

function insertRank({ isbn, prevRankId }: NewRanking): Promise<void> {
  return new Promise((resolve, reject) => {
    supabase
      .from(RANKINGS_TABLE)
      .insert({
        isbn,
        prevRankId,
      })
      .then(() => resolve());
  });
}

export default function useRank() {
  return useMutation({
    mutationFn: insertRank,
  });
}
