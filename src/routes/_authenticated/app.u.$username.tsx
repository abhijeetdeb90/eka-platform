import { useEffect } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen, EmptyState } from "@/components/app/AppScreen";
import { ProfileView } from "@/components/app/ProfileView";
import { fetchProfileByUsername } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/_authenticated/app/u/$username")({
  component: PublicProfile,
});

function PublicProfile() {
  const { username } = useParams({ from: "/_authenticated/app/u/$username" });
  const { data: me } = useProfile();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfileByUsername(username),
  });

  useEffect(() => {
    if (profile) track("profile_view", { profile_id: profile.id });
  }, [profile]);

  if (isLoading) return <AppScreen title="Profile">Loading…</AppScreen>;
  if (!profile)
    return (
      <AppScreen title="Profile">
        <EmptyState title="No such person" body="This profile doesn't exist on EKA." />
      </AppScreen>
    );

  return <ProfileView profile={profile} isSelf={me?.id === profile.id} />;
}
