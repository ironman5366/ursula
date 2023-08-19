
CREATE TABLE "public"."books" (
    "id": BIGINT NOT NULL
    -- TODO!
)

CREATE TABLE "public"."reading_lists" (
    "id" bigint NOT NULL,
    "crated_at" timestamp with time zone DEFAULT "now"(),
    "user_uid" "uuid" NOT NULL,
    "isbn" character varying NOT NULL,
    "prev_ranking_id" bigint
)