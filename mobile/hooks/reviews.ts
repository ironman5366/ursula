import { supabase } from "../utils/supabase.ts";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Review } from "@ursula/shared-types/derived.ts";

interface CreateReviewParams {
  userId: string;
  bookId: number;
  note: string | null;
}

async function createReview({
  userId,
  bookId,
  note,
}: CreateReviewParams): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      {
        user_id: userId,
        book_id: bookId,
        note: note,
      },
      {
        onConflict: "user_id, book_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function useCreateReview() {
  const { session } = useSession();

  return useMutation({
    mutationFn: (vars: Omit<CreateReviewParams, "userId">) =>
      createReview({
        ...vars,
        userId: session.user.id,
      }),
  });
}
