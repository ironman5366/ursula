import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase";
import { PostgrestResponse } from "@supabase/supabase-js";
import { ReviewRow } from "../../shared-types/derived";

async function retrieveReviews(): Promise<PostgrestResponse<ReviewRow>> {
  return supabase.from("reviews").select();
}

export default function useReviews() {
  return useQuery(["REVIEW_LOOKUP"], retrieveReviews);
}
