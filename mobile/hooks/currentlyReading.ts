import { supabase } from "../utils/supabase.ts";
import { WithTime } from "../types/WithTime.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "../contexts/SessionContext.ts";
import { useRecordActivity } from "./activities.ts";
import { ActivityType } from "@ursula/shared-types/Activity.ts";

async function fetchCurrentlyReading(
  userId: string
): Promise<WithTime<Book>[]> {
  const { data, error } = await supabase
    .from("currently_reading_items")
    .select("*, books(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((b) => {
    return {
      ...b.books,
      created_at: b.created_at,
    };
  });
}

export function useCurrentlyReading(userId: string) {
  return useQuery({
    queryFn: () => fetchCurrentlyReading(userId),
    queryKey: ["CURRENTLY_READING", userId],
  });
}

export function useCurrentUserCurrentlyReading() {
  const { session } = useSession();
  return useCurrentlyReading(session.user.id);
}

async function markReading(userId: string, bookId: number) {
  const { data, error } = await supabase.from("currently_reading_items").upsert(
    {
      user_id: userId,
      book_id: bookId,
    },
    {
      onConflict: "user_id,book_id",
    }
  );

  if (error) {
    throw error;
  }
}

interface MarkReadingVariables {
  book: Book;
  note?: string;
}

export function useMarkReading() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const { mutate: recordActivity } = useRecordActivity();

  return useMutation({
    mutationFn: ({ book }: MarkReadingVariables) =>
      markReading(session.user.id, book.id),
    onSuccess: (_data, vars) => {
      recordActivity({
        type: ActivityType.STARTED_READING,
        data: {
          book_id: vars.book.id,
          book_name: vars.book.title,
          note: vars.note,
        },
      });
      queryClient.invalidateQueries(["CURRENTLY_READING", session.user.id]);
    },
  });
}

async function markNotReading(userId: string, bookId: number) {
  const { error } = await supabase
    .from("currently_reading_items")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  if (error) {
    throw error;
  }
}

export function useMarkNotReading() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => markNotReading(session.user.id, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries(["CURRENTLY_READING", session.user.id]);
    },
  });
}
