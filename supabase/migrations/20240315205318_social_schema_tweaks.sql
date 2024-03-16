ALTER TABLE activities RENAME COLUMN "activity_type" TO "type";
ALTER TABLE activities RENAME COLUMN "activity_data" TO "data";

CREATE OR REPLACE FUNCTION social_feed(for_user_id UUID) RETURNS SETOF ACTIVITIES LANGUAGE sql AS $$
    SELECT activities.* FROM activities JOIN follows ON activities.user_id = follows.follower_id WHERE follows.followee_id = for_user_id;
$$;
