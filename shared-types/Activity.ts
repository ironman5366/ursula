export enum ActivityType {
  RANKED = "ranked",
  STARTED_READING = "started_reading",
  ADDED_TO_LIST = "added",
  FOLLOWED = "followed",
  RECOMMENDED = "recommended",
  JOINED = "joined",
  POSTED_NOTE = "posted_note",
}

export type StartedReadingActivity = {
  type: ActivityType.STARTED_READING;
  data: {
    book_id: number;
    book_name: string;
    note?: string;
  };
};

export type RankedActivity = {
  type: ActivityType.RANKED;
  data: {
    review_id: number;
    book_name: string;
    book_id: number;
    rank: number;
    total: number;
    note?: string;
  };
};

export type AddedToListActivity = {
  type: ActivityType.ADDED_TO_LIST;
  data: {
    book_id: number;
    book_name: string;
  };
};

export type FollowedActivity = {
  type: ActivityType.FOLLOWED;
  data: {
    user_id: string;
    username: string;
    full_name: string;
  };
};

export type RecommendedActivity = {
  type: ActivityType.RECOMMENDED;
  data: {
    book_id: number;
    book_name: string;
    recipient_id: string;
    recipient_name: string;
    note?: string;
  };
};

export type JoinedActivity = {
  type: ActivityType.JOINED;
  data: {
    user_id: string;
    username: string;
    full_name: string;
  };
};

export type PostedNoteActivity = {
  type: ActivityType.POSTED_NOTE;
  data: {
    book_id: number;
    book_name: string;
    note: string;
  };
};

export type ActivityData =
  | StartedReadingActivity
  | RankedActivity
  | AddedToListActivity
  | FollowedActivity
  | RecommendedActivity
  | JoinedActivity
  | PostedNoteActivity;
