import { PostgrestResponse } from "https://esm.sh/v131/@supabase/postgrest-js@1.8.0/dist/module/types.d.ts";

export function coerceSingleResponse<T extends { id: number }>({
  data,
  error,
}: PostgrestResponse<T>): T | null {
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

export function coerceId<T extends { id: number }>(
  resp: PostgrestResponse<T>
): number | null {
  const singleResponse = coerceSingleResponse(resp);
  if (singleResponse === null) {
    return null;
  }

  return singleResponse.id;
}

// Copied from https://www.30secondsofcode.org/js/s/levenshtein-distance/
export function levenshteinDistance(source: string, target: string) {
  if (!source.length) return target.length;
  if (!target.length) return source.length;
  const arr = [];
  for (let i = 0; i <= target.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= source.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (source[j - 1] === target[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[target.length][source.length];
}
