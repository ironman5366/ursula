import { useMutation } from "@tanstack/react-query";
import { getUser, supabase } from "../utils/supabase";
import { REVIEWS_TABLE } from "../constants";

interface NewRanking {
  isbn: number;
  prevReviewId: number | null;
}

function insertReview({ isbn, prevReviewId }: NewRanking): Promise<void> {
  console.log("About to review!");
  return new Promise((resolve, reject) => {
    getUser().then((user) => {
      supabase
        .from(REVIEWS_TABLE)
        .insert({
          isbn,
          prev_review_id: prevReviewId,
          user_uid: user.id,
        })
        .then(() => {
          resolve();
        });
    });
  });
}

export default function useReview() {
  return useMutation({
    mutationFn: insertReview,
  });
}
