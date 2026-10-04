// ==============================================================================
// EKA FOUNDER / ADMIN — ACCESS GUARD
// ==============================================================================
// Reusable guard for TanStack beforeLoad.
// ==============================================================================

import { verifyFounderAdminAccess } from "@/lib/auth/access-control";

export async function founderAdminBeforeLoad() {
  return await verifyFounderAdminAccess("/");
}
