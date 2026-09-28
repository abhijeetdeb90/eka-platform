import { useQuery } from "@tanstack/react-query";
import { DEFAULT_FLAGS, fetchFlags, type FeatureFlag, type Flags } from "@/lib/flags";

export function useFlags(): Flags {
  const { data } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: fetchFlags,
    staleTime: 5 * 60_000,
  });
  return data ?? DEFAULT_FLAGS;
}

export function useFeatureFlag(flag: FeatureFlag): boolean {
  return useFlags()[flag];
}
