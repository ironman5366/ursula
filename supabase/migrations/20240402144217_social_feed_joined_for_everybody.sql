CREATE OR REPLACE FUNCTION social_feed(for_user_id uuid) RETURNS SETOF activities
LANGUAGE sql
AS
$$
SELECT DISTINCT ON (feed.id) feed.*
FROM (SELECT activities.*
      FROM activities
               JOIN follows ON activities.user_id = follows.followee_id
      WHERE follows.follower_id =
            for_user_id
  UNION
      SELECT activities.*
      FROM activities
      WHERE activities.type = 'joined') feed
$$;
