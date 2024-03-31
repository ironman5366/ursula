-- Change all the "profiles" foreign keys to be cascades
ALTER TABLE follows DROP CONSTRAINT fk_follows_followee_id;
ALTER TABLE follows ADD CONSTRAINT fk_follows_followee_id FOREIGN KEY (followee_id) REFERENCES profiles (id) ON DELETE CASCADE;
ALTER TABLE follows DROP CONSTRAINT fk_follows_follower_id;
ALTER TABLE follows ADD CONSTRAINT fk_follows_follower_id FOREIGN KEY (follower_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE activities DROP CONSTRAINT fk_user_activities_user_id;
ALTER TABLE activities ADD CONSTRAINT fk_user_activities_user_id FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE reading_list_items DROP CONSTRAINT user_id;
ALTER TABLE reading_list_items ADD CONSTRAINT fk_reading_list_items_user_id FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE reading_lists DROP CONSTRAINT fk_reading_lists_user_id;
ALTER TABLE reading_lists ADD CONSTRAINT fk_reading_lists_user_id FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE recommendations DROP CONSTRAINT fk_recommendations_recomendee_id;
ALTER TABLE recommendations ADD CONSTRAINT fk_recommendations_recomendee_id FOREIGN KEY (recomendee_id) REFERENCES profiles (id) ON DELETE CASCADE;
ALTER TABLE recommendations DROP CONSTRAINT fk_recommendations_recomender_id;
ALTER TABLE recommendations ADD CONSTRAINT fk_recommendations_recomender_id FOREIGN KEY (recomender_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE reviews DROP CONSTRAINT user_id;
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user_id FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;

ALTER TABLE currently_reading_items DROP CONSTRAINT currently_reading_items_user_id_fkey;
ALTER TABLE currently_reading_items ADD CONSTRAINT fk_currently_reading_items_user_id FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE;
