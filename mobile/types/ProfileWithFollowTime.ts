import { Profile } from "@ursula/shared-types/derived.ts";

export type ProfileWithFollowTime = Profile & {
  created_at: string;
};
