import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, supabase } from "../utils/supabase";
import { REVIEWS_TABLE } from "../constants";
import { InsertReview } from "../types/derived";
import { updateReview } from "./useUpdateReview";

interface NewReview extends InsertReview {
  // Optionally, a review that should be altered
  alter_review_id?: number;
}

function insertReview({
  isbn,
  prev_review_id,
  alter_review_id,
}: NewReview): Promise<void> {
  return new Promise((resolve, reject) => {
    getUser().then((user) => {
      supabase
        .from(REVIEWS_TABLE)
        .insert({
          isbn,
          prev_review_id,
          user_uid: user.id,
        })
        .select()
        .then((data) => {
          if (alter_review_id !== undefined) {
            if (data.data) {
              updateReview({
                id: alter_review_id,
                prev_review_id: data.data[0].id,
              }).then(() => resolve());
            } else {
              reject(
                new Error(
                  "No data from inserting row, couldn't update corresponding record"
                )
              );
            }
          }
          resolve();
        });
    });
  });
}

export default function useInsertReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insertReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["REVIEW_LOOKUP"]);
    },
  });
}
