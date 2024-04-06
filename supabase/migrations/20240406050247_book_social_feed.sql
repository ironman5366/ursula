CREATE INDEX IF NOT EXISTS idx_activities_data_book_id ON activities USING btree ((data ->> 'book_id'));

CREATE OR REPLACE FUNCTION book_social_feed(for_user_id uuid, for_book_id int) RETURNS SETOF activities
LANGUAGE sql AS
$$
SELECT activities.*
FROM activities
         JOIN follows ON activities.user_id = follows.followee_id
WHERE follows.follower_id =
      for_user_id
  AND (activities.data ->> 'book_id')::int = for_book_id;
$$
