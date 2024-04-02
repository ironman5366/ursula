CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities (user_id);
CREATE INDEX IF NOT EXISTS activities_type_idx ON activities (type);
CREATE INDEX IF NOT EXISTS idx_activities_data_user_id ON activities USING btree ((data ->> 'user_id'));

-- Users get
-- All activities from users they follow
-- All join activities
-- All activities of anybody following them
CREATE OR REPLACE FUNCTION social_feed(for_user_id uuid) RETURNS SETOF activities
LANGUAGE sql
AS
$$
SELECT DISTINCT ON (feed.id) feed.* FROM (
     SELECT
         activities.* FROM activities JOIN follows ON activities.user_id = follows.followee_id WHERE follows.follower_id =
                                                                                                     for_user_id
     UNION
     SELECT activities.*  FROM activities WHERE activities.type = 'joined'
     UNION
     SELECT activities.* FROM activities WHERE activities.type = 'followed' AND activities.data->>'user_id' = for_user_id::text
 ) feed
$$;
