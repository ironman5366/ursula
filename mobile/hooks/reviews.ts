import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Profile, Review } from "@ursula/shared-types/derived.ts";
import useProfile from "./useProfile.ts";
import ReviewWithBook from "../types/ReviewWithBook.ts";

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

async function fetchReviews(profile: Profile): Promise<ReviewWithBook[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, books(*)")
    .in("id", profile.review_ids);

  if (error) {
    throw error;
  }

  return data.map(({ books: book, ...review }) => ({
    review,
    book,
  }));
}

export function useReviews(userId: string) {
  const { data: profile, ...rest } = useProfile(userId);
  return useQuery({
    enabled: !!profile,
    queryFn: () => fetchReviews(profile),
  });
}

export function useCurrentUserReviews() {
  const { session } = useSession();
  return useReviews(session.user.id);
}
