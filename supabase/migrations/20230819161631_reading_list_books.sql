CREATE TABLE "public"."authors" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now"(),
    "name" CHARACTER VARYING NOT NULL
);

CREATE TABLE "public"."books" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT "now"(),
    "isbn" CHARACTER VARYING NOT NULL,
    "description" TEXT
);

CREATE TABLE "public"."reading_lists" (
    "id" BIGINT NOT NULL,
    "crated_at" TIMESTAMP WITH TIME ZONE DEFAULT "now"(),
    "user_uid" "uuid" NOT NULL,
    "isbn" CHARACTER VARYING NOT NULL,
    "prev_ranking_id" BIGINT
);
