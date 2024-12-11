import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <AdminSidebar />
      </div>
      <main className="md:pl-72">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
