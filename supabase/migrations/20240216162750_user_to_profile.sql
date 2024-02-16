create table if not exists public.users
(
    id uuid not null
    primary key
    references auth.users
    on delete cascade,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text,
    review_ids integer [] default '{}'::integer [] not null,
    created_at timestamp with time zone default now() not null
);

-- Remove the "username" column
alter table "public"."users" drop column if exists username;

-- If the "profiles" table doesnt exist, rename the "users" table to profiles. This is because of a weird
-- out of sync issue between local and remote

do $$
    BEGIN
        IF NOT EXISTS (SELECT * FROM information_schema.tables WHERE table_name = 'profiles') THEN
            ALTER TABLE "public"."users" RENAME TO "profiles";
        END IF;
    END;
$$ language plpgsql;
