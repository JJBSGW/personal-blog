import { Suspense } from "react";
import { AdminLoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
