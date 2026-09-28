import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  fetchEpisodeFollow,
  followEpisode,
  setFollowPrefs,
  unfollowEpisode,
} from "@/lib/questions";

/**
 * Follow a conversation to hear when the host pins or answers your question,
 * when it rises in the room, and when the session is scheduled or published.
 */
export function FollowEpisode({ episodeId }: { episodeId: string }) {
  const qc = useQueryClient();
  const key = ["episode-follow", episodeId];
  const { data: follow } = useQuery({
    queryKey: key,
    queryFn: () => fetchEpisodeFollow(episodeId),
  });

  const refresh = () => void qc.invalidateQueries({ queryKey: key });

  const toggle = useMutation({
    mutationFn: async () => {
      if (follow) await unfollowEpisode(episodeId);
      else await followEpisode(episodeId);
    },
    onSuccess: () => {
      refresh();
      toast.success(follow ? "Unfollowed." : "Following. We'll tell you when it moves.");
    },
  });

  const pref = async (patch: { notify_questions?: boolean; notify_schedule?: boolean }) => {
    if (!follow) return;
    await setFollowPrefs(follow.id, patch);
    refresh();
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          {follow ? "You're following this conversation" : "Follow this conversation"}
          <span className="block text-xs text-muted-foreground">
            Updates when your question is pinned, answered, or rises in the room.
          </span>
        </p>
        <Button size="sm" variant={follow ? "outline" : "default"} onClick={() => toggle.mutate()}>
          {follow ? (
            <BellOff className="mr-1.5 size-4" aria-hidden />
          ) : (
            <Bell className="mr-1.5 size-4" aria-hidden />
          )}
          {follow ? "Following" : "Follow"}
        </Button>
      </div>

      {follow && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Tell me about my questions</span>
            <input
              type="checkbox"
              checked={follow.notify_questions}
              onChange={(e) => void pref({ notify_questions: e.target.checked })}
              className="size-4 accent-current"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">Tell me when it's scheduled or published</span>
            <input
              type="checkbox"
              checked={follow.notify_schedule}
              onChange={(e) => void pref({ notify_schedule: e.target.checked })}
              className="size-4 accent-current"
            />
          </label>
        </div>
      )}
    </div>
  );
}
