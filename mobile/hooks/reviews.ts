import { supabase } from "../utils/supabase.ts";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
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
  const sortedIds = reviewIds.sort();
  return useQuery({
    queryFn: () => fetchReviewIds(sortedIds),
    queryKey: ["REVIEW_DATA", sortedIds],
    enabled,
  });
}

function orderReviews(profile: Profile, reviews: ReviewWithBook[]) {
  console.log("ordering reviews by", profile.review_ids);
  return profile.review_ids.map((id) =>
    reviews.find((r) => r.review.id === id)
  );
}

export function useReviews(userId: string) {
  const { data: profile } = useProfile(userId);
  console.log("profile reviewIds are", profile?.review_ids);
  const { data: reviewData } = useReviewData(
    profile?.review_ids || [],
    !!profile
  );

  return useQuery({
    queryFn: () => {
      return orderReviews(profile, reviewData);
    },
    enabled: !!profile && !!reviewData,
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
