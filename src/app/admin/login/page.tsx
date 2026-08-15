import { Suspense } from "react";
import { getSiteConfig } from "@/lib/site-config";
import { AdminLoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const site = await getSiteConfig();
  return (
    <Suspense fallback={null}>
      <AdminLoginForm siteName={site.name} />
    </Suspense>
  );
}
