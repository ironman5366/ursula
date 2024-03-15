ALTER TABLE activities RENAME COLUMN "activity_type" TO "type";
ALTER TABLE activities RENAME COLUMN "activity_data" TO "data";

CREATE OR REPLACE FUNCTION social_feed(user_id UUID) RETURNS SETOF ACTIVITIES LANGUAGE plpgsql AS $$
    SELECT * FROM activities JOIN follows ON activities.user_id = follows.follower_id WHERE follows.followee_id = user_id;
$$
