import {PostgrestResponse} from "https://esm.sh/v131/@supabase/postgrest-js@1.8.0/dist/module/types.d.ts";

export function coerceSingleResponse<T extends { id: number }>({ data, error }: PostgrestResponse<T>): T | null {
    if (error) {
        return null;
    }

    if (data === null) {
        return null;
    }

    if (data.length !== 1) {
        return null;
    }

    return data[0];
}

export function coerceId<T extends { id: number }>(resp: PostgrestResponse<T>): number | null {
    const singleResponse = coerceSingleResponse(resp);
    if (singleResponse === null) {
        return null;
    }

    return singleResponse.id;
}