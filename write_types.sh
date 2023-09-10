#!/usr/bin/env bash
npx supabase gen types typescript --linked > .database.temp.ts
cp .database.temp.ts mobile/types/Database.ts
cp .database.temp.ts supabase/functions/book-search/types/Database.ts
rm .database.temp.ts
deno fmt
