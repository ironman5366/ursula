CREATE POLICY "Users can only create a review for themself"
ON public.reviews FOR INSERT WITH CHECK (
    auth.jwt() ->> 'uid' = 'user_uid'
);

CREATE POLICY "Users can only update a review for themself"
ON public.reviews FOR UPDATE USING (
    auth.jwt() ->> 'uid' = 'user_uid'
);

CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT USING (
    true
);
