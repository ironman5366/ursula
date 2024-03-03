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
import { useProfile, useUpdateProfile } from "./profile.ts";
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

async function fetchReviewIds(reviewIds: number[]): Promise<ReviewWithBook[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, books(*)")
    .in("id", reviewIds);

  if (error) {
    throw error;
  }

  return data.map(({ books: book, ...review }) => ({ review, book }));
}

function useReviewData(reviewIds: number[], enabled: boolean) {
  // sort the review IDs so we get a consistent query key
  const sortedIds = [...reviewIds].sort();
  return useQuery({
    queryFn: () => fetchReviewIds(sortedIds),
    queryKey: ["REVIEW_DATA", sortedIds],
    enabled,
  });
}

function orderReviews(profile: Profile, reviews: ReviewWithBook[]) {
  return profile.review_ids.map((id) =>
    reviews.find((r) => r.review.id === id)
  );
}

export function useReviews(userId: string) {
  const { data: profile } = useProfile(userId);
  const { data: reviewData } = useReviewData(
    profile?.review_ids || [],
    !!profile
  );

  if (profile && reviewData) {
    return {
      data: orderReviews(profile, reviewData),
      isLoading: false,
    };
  } else {
    return {
      data: undefined,
      isLoading: true,
    };
  }
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

async function fetchBookReview(
  bookId: number,
  userId: string
): Promise<Review | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function useBookReview(bookId: number, userId: string) {
  return useQuery({
    queryKey: ["BOOK_REVIEW", bookId, userId],
    queryFn: () => fetchBookReview(bookId, userId),
  });
}

export function useBookIsReviewed(bookId: number) {
  const { session } = useSession();
  const { data: review, ...rest } = useBookReview(bookId, session.user.id);
  return {
    ...rest,
    isReviewed: !!review,
  };
}

export function useRemoveReview(bookId: number) {
  // Update the profile to remove the review ID from review_ids, and delete the review from the database.
  // Do this in sequence, so that if the profile update fails, the review is not deleted.
  const profileMutation = useUpdateProfile();
  const queryClient = useQueryClient();
  const { session } = useSession();
}
