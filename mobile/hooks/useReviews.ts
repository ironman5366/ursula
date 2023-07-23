import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { REVIEWS_TABLE } from "../constants";
import { PostgrestResponse } from "@supabase/supabase-js";
import { Database } from "../types/Database";

async function retrieveReviews(): Promise<
  PostgrestResponse<Database["public"]["Tables"]["reviews"]>
> {
  return supabase.from(REVIEWS_TABLE).select();
}

export default function useReviews() {
  return useQuery(["REVIEW_LOOKUP"], retrieveReviews);
}
