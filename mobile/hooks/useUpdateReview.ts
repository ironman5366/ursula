import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewRow, UpdateReview } from "../types/derived";
import { getUser, supabase } from "../utils/supabase";
import { REVIEWS_TABLE } from "../constants";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface UpdatePayload extends UpdateReview {
  id: number;
}

export function updateReview({ id, ...rest }: UpdatePayload): Promise<void> {
  return new Promise((resolve, reject) => {
    getUser().then((user) => {
      supabase
        .from(REVIEWS_TABLE)
        .update<UpdateReview>(rest)
        .eq("id", id)
        .then(() => resolve());
    });
  });
}

export default function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["REVIEW_LOOKUP"]);
    },
  });
}
