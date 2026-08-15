import { getSiteConfig } from "@/lib/site-config";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const site = await getSiteConfig();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">站点设置</h1>
      <SettingsForm site={site} />
    </div>
  );
}
