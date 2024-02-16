DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON "public"."profiles";

CREATE POLICY "Public profiles are viewable by everyone."
ON profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON "public"."profiles";
CREATE POLICY "Users can insert their own profile."
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON "public"."profiles";
CREATE POLICY "Users can update own profile."
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- inserts a row into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
begin
    insert into "public"."profiles" (id)
    values (new.id);
    return new;
end;
$$;

-- trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON "auth"."users"
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
