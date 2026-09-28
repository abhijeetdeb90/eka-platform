import { createFileRoute } from "@tanstack/react-router";
import { AppScreen } from "@/components/app/AppScreen";
import { ProfileView } from "@/components/app/ProfileView";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/app/me")({
  component: MyProfile,
});

function MyProfile() {
  const { data: profile } = useProfile();
  if (!profile) return <AppScreen title="Profile">Loading…</AppScreen>;
  return <ProfileView profile={profile} isSelf />;
}
