
CREATE TABLE "public"."authors" (
    "id" BIGINT NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying NOT NULL
);

CREATE TABLE "public"."books" (
    "id" BIGINT NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "isbn" character varying NOT NULL,
    "description" TEXT 
);

CREATE TABLE "public"."reading_lists" (
    "id" bigint NOT NULL,
    "crated_at" timestamp with time zone DEFAULT "now"(),
    "user_uid" "uuid" NOT NULL,
    "isbn" character varying NOT NULL,
    "prev_ranking_id" bigint
);