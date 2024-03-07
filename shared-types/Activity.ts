export enum ActivityType {
  REVIEWED = "reviewed",
  STARTED_READING = "started_reading",
  ADDED_TO_LIST = "added",
  FOLLOWED = "followed",
  RECOMMENDED = "recommended",
}

type StartedReadingActivity = {
  type: ActivityType.STARTED_READING;
  book_id: number;
};

type ReviewedActivity = {
  type: ActivityType.REVIEWED;
  review_id: number;
};

type AddedToListActivity = {
  type: ActivityType.ADDED_TO_LIST;
  book_id: number;
};

type FollowedActivity = {
  type: ActivityType.FOLLOWED;
  user_id: number;
};

type RecommendedActivity = {
  type: ActivityType.RECOMMENDED;
  book_id: number;
};

type Activity =
  | StartedReadingActivity
  | ReviewedActivity
  | AddedToListActivity
  | FollowedActivity
  | RecommendedActivity;

export default Activity;
