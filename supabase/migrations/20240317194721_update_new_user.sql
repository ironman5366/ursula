CREATE OR REPLACE FUNCTION handle_new_user() RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS
$$
begin
    insert into "public"."profiles" (id, username)
    values (new.id, new.email);
    return new;
end;
$$;
