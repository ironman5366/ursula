DROP SCHEMA IF EXISTS public CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE FUNCTION public.handle_new_user()
    RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
    insert into "public"."profiles" (id)
    values (new.id);
    return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."authors" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."authors" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."authors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."authors_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."authors_id_seq" OWNED BY "public"."authors"."id";

CREATE TABLE IF NOT EXISTS "public"."book_authors" (
    "id" integer NOT NULL,
    "book_id" integer,
    "author_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."book_authors" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."book_authors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."book_authors_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."book_authors_id_seq" OWNED BY "public"."book_authors"."id";

CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "large_thumbnail_key" "text",
    "small_thumbnail_key" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author_key" character varying(255)
);

ALTER TABLE "public"."books" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."books_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."books_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."books_id_seq" OWNED BY "public"."books"."id";

CREATE TABLE IF NOT EXISTS "public"."editions" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "book_id" integer NOT NULL,
    "isbn_10" "text",
    "isbn_13" "text",
    "google_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."editions" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."editions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."editions_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."editions_id_seq" OWNED BY "public"."editions"."id";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "full_name" "text",
    "avatar_url" "text",
    "review_ids" integer[] DEFAULT '{}'::integer[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."reading_list_items" (
    "id" integer NOT NULL,
    "book_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."reading_list_items" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."reading_list_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."reading_list_items_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."reading_list_items_id_seq" OWNED BY "public"."reading_list_items"."id";

CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" integer NOT NULL,
    "book_id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."reviews" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."reviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."reviews_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."reviews_id_seq" OWNED BY "public"."reviews"."id";

CREATE TABLE IF NOT EXISTS "public"."search_cache_entries" (
    "id" integer NOT NULL,
    "query_id" integer,
    "book_id" integer,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."search_cache_entries" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."search_cache_entries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."search_cache_entries_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."search_cache_entries_id_seq" OWNED BY "public"."search_cache_entries"."id";

CREATE TABLE IF NOT EXISTS "public"."search_cache_queries" (
    "id" integer NOT NULL,
    "query" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "public"."search_cache_queries" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."search_cache_queries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."search_cache_queries_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."search_cache_queries_id_seq" OWNED BY "public"."search_cache_queries"."id";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "full_name" "text",
    "avatar_url" "text",
    "review_ids" integer[] DEFAULT '{}'::integer[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."authors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."authors_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."book_authors" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."book_authors_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."books" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."books_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."editions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."editions_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."reading_list_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."reading_list_items_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."reviews" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."reviews_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."search_cache_entries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."search_cache_entries_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."search_cache_queries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."search_cache_queries_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "author_key_title_unique" UNIQUE ("name", "author_key");

ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."authors"
    ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_unique" UNIQUE ("author_id", "book_id");

ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."editions"
    ADD CONSTRAINT "editions_google_id_key" UNIQUE ("google_id");

ALTER TABLE ONLY "public"."editions"
    ADD CONSTRAINT "editions_isbn_10_key" UNIQUE ("isbn_10");

ALTER TABLE ONLY "public"."editions"
    ADD CONSTRAINT "editions_isbn_13_key" UNIQUE ("isbn_13");

ALTER TABLE ONLY "public"."editions"
    ADD CONSTRAINT "editions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reading_list_items"
    ADD CONSTRAINT "reading_list_items_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."reading_list_items"
    ADD CONSTRAINT "reading_list_items_user_id_book_id_unique" UNIQUE ("user_id", "book_id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."search_cache_entries"
    ADD CONSTRAINT "search_cache_entries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."search_cache_queries"
    ADD CONSTRAINT "search_cache_queries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."search_cache_queries"
    ADD CONSTRAINT "search_cache_queries_query_key" UNIQUE ("query");

ALTER TABLE ONLY "public"."search_cache_entries"
    ADD CONSTRAINT "unique_book_query" UNIQUE ("book_id", "query_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id");

ALTER TABLE ONLY "public"."book_authors"
    ADD CONSTRAINT "book_authors_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id");

ALTER TABLE ONLY "public"."editions"
    ADD CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reading_list_items"
    ADD CONSTRAINT "book_id" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."search_cache_entries"
    ADD CONSTRAINT "search_cache_entries_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id");

ALTER TABLE ONLY "public"."search_cache_entries"
    ADD CONSTRAINT "search_cache_entries_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "public"."search_cache_queries"("id");

ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."reading_list_items"
    ADD CONSTRAINT "user_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."authors" TO "anon";
GRANT ALL ON TABLE "public"."authors" TO "authenticated";
GRANT ALL ON TABLE "public"."authors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."authors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."book_authors" TO "anon";
GRANT ALL ON TABLE "public"."book_authors" TO "authenticated";
GRANT ALL ON TABLE "public"."book_authors" TO "service_role";

GRANT ALL ON SEQUENCE "public"."book_authors_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."book_authors_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."book_authors_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."books" TO "anon";
GRANT ALL ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";

GRANT ALL ON SEQUENCE "public"."books_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."books_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."books_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."editions" TO "anon";
GRANT ALL ON TABLE "public"."editions" TO "authenticated";
GRANT ALL ON TABLE "public"."editions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."editions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."editions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."editions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."reading_list_items" TO "anon";
GRANT ALL ON TABLE "public"."reading_list_items" TO "authenticated";
GRANT ALL ON TABLE "public"."reading_list_items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reading_list_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reading_list_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reading_list_items_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";

GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."search_cache_entries" TO "anon";
GRANT ALL ON TABLE "public"."search_cache_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."search_cache_entries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."search_cache_entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."search_cache_entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."search_cache_entries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."search_cache_queries" TO "anon";
GRANT ALL ON TABLE "public"."search_cache_queries" TO "authenticated";
GRANT ALL ON TABLE "public"."search_cache_queries" TO "service_role";

GRANT ALL ON SEQUENCE "public"."search_cache_queries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."search_cache_queries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."search_cache_queries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
