CREATE OR REPLACE FUNCTION social_feed(for_user_id uuid) RETURNS SETOF activities
LANGUAGE sql
AS
$$
SELECT activities.* FROM activities JOIN follows ON activities.user_id = follows.followee_id WHERE follows.follower_id = for_user_id;
$$;
