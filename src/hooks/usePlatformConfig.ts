import { useQuery } from "@tanstack/react-query";
import { DEFAULT_CONFIG, fetchConfig, type PlatformConfig } from "@/lib/config";

/** Live platform economics, falling back to today's numbers while loading. */
export function usePlatformConfig(): PlatformConfig {
  const { data } = useQuery({
    queryKey: ["platform-config"],
    queryFn: fetchConfig,
    staleTime: 5 * 60_000,
  });
  return data ?? DEFAULT_CONFIG;
}
