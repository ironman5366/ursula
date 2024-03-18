export enum ActivityType {
  RANKED = "ranked",
  STARTED_READING = "started_reading",
  ADDED_TO_LIST = "added",
  FOLLOWED = "followed",
  RECOMMENDED = "recommended",
}

export type StartedReadingActivity = {
  type: ActivityType.STARTED_READING;
  data: {
    book_id: number;
    book_name: string;
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
    user_id: number;
    username: string;
  };
};

export type RecommendedActivity = {
  type: ActivityType.RECOMMENDED;
  data: {
    book_id: number;
  };
};

export type ActivityData =
  | StartedReadingActivity
  | RankedActivity
  | AddedToListActivity
  | FollowedActivity
  | RecommendedActivity;
