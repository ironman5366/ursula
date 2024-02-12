ALTER POLICY "Users can only create a review for themself"
ON public.reviews WITH CHECK (
    auth.uid() = user_uid
);

ALTER POLICY "Users can only update a review for themself"
ON public.reviews USING (
    auth.uid() = user_uid
);
