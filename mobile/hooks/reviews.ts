import { supabase } from "../utils/supabase.ts";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { Profile, Review } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../types/ReviewWithBook.ts";
import { useCurrentProfile, useProfile, useUpdateProfile } from "./profile.ts";
import { useRemoveFromReadingList } from "./readingList.ts";

interface CreateReviewParams {
  userId: string;
  bookId: number;
  note: string | null;
}

async function createReview({
  userId,
  bookId,
  note,
}: CreateReviewParams): Promise<ReviewWithBook> {
  const {
    data: { books: book, ...review },
    error,
  } = await supabase
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
    .select("*, books(*)")
    .single();

  if (error) {
    throw error;
  }

  return {
    book,
    review,
  };
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
      queryClient.setQueryData(["REVIEW", data.review.id], data);
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

interface RankMutationVariables {
  profile: Profile;
  review: Review;
  rankIdx: number;
}

export function useRank(
  // The user may wish to redirect on success, give them the option
  options?: Omit<
    UseMutationOptions<void, any, RankMutationVariables, any>,
    "mutationFn"
  >
) {
  // A "rank" mutation is actually a combination of two mutations: one to update the profile with the new review ID,
  // and one to remove the book from the reading list
  const profileMutation = useUpdateProfile();
  const readingListMutation = useRemoveFromReadingList();

  return useMutation({
    mutationFn: async ({ profile, review, rankIdx }: RankMutationVariables) => {
      const reviewId = review.id;
      let newReviews;

      // If this review is already in the profile, remove it, and decrement
      // rankIdx to make up for the change
      if (profile.review_ids.includes(reviewId)) {
        newReviews = profile.review_ids.filter((id) => id !== reviewId);
        if (rankIdx > profile.review_ids.indexOf(reviewId)) {
          rankIdx--;
        }
      } else {
        newReviews = profile.review_ids;
      }

      newReviews.splice(rankIdx, 0, reviewId);
      await Promise.all([
        profileMutation.mutateAsync({
          review_ids: newReviews,
        }),
        readingListMutation.mutateAsync(review.book_id),
      ]);
    },
    ...options,
  });
}
