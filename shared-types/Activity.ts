export enum ActivityType {
  REVIEWED = "reviewed",
  STARTED_READING = "started_reading",
  ADDED_TO_LIST = "added",
  FOLLOWED = "followed",
  RECOMMENDED = "recommended",
}

type StartedReadingActivity = {
  type: ActivityType.STARTED_READING;
  data: {
    book_id: number;
  };
};

type ReviewedActivity = {
  type: ActivityType.REVIEWED;
  data: {
    review_id: number;
  };
};

type AddedToListActivity = {
  type: ActivityType.ADDED_TO_LIST;
  data: {
    book_id: number;
  };
};

type FollowedActivity = {
  type: ActivityType.FOLLOWED;
  data: {
    user_id: number;
  };
};

type RecommendedActivity = {
  type: ActivityType.RECOMMENDED;
  data: {
    book_id: number;
  };
};

export type ActivityData =
  | StartedReadingActivity
  | ReviewedActivity
  | AddedToListActivity
  | FollowedActivity
  | RecommendedActivity;
