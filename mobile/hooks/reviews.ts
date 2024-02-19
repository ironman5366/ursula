import { supabase } from "../utils/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Profile, Review } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../types/ReviewWithBook.ts";
import { useProfile } from "./profile.ts";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: Omit<CreateReviewParams, "userId">) =>
      createReview({
        ...vars,
        userId: session.user.id,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["REVIEW", data.id], data);
    },
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

  const orderedReviewsWithBooks: ReviewWithBook[] = [];
  for (const reviewId of profile.review_ids) {
    const { books: book, ...review } = data.find((r) => r.id === reviewId);
    orderedReviewsWithBooks.push({ review, book });
  }

  return orderedReviewsWithBooks;
}

export function useReviews(userId: string) {
  const { data: profile, ...rest } = useProfile(userId);
  return useQuery({
    enabled: !!profile,
    queryFn: () => fetchReviews(profile),
    queryKey: ["REVIEWS", userId],
  });
}

export function useCurrentUserReviews() {
  const { session } = useSession();
  return useReviews(session.user.id);
}

async function fetchReview(reviewId: number): Promise<ReviewWithBook> {
  const {
    data: { books: book, ...review },
    error,
  } = await supabase
    .from("reviews")
    .select("*, books(*)")
    .eq("id", reviewId)
    .single();

  if (error) {
    throw error;
  }

  console.log("returning single review ", { book, review });

  return {
    book,
    review,
  };
}

export function useReview(reviewId: number) {
  return useQuery({
    queryKey: ["REVIEW", reviewId],
    queryFn: () => fetchReview(reviewId),
  });
}
