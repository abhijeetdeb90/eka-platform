// ==============================================================================
// BRANDS / ENTERPRISE — ACCESS GUARD
// ==============================================================================
// Reusable guard for TanStack beforeLoad.
// ==============================================================================

import { verifyBrandEnterpriseAccess } from "@/lib/auth/access-control";

export async function brandsEnterpriseBeforeLoad() {
  return await verifyBrandEnterpriseAccess("/");
}
