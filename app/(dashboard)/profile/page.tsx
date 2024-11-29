import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import ProfileTabs from "@/components/profile/profile-tabs";

export default async function ProfilePage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  // Fetch profile data
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  console.log(notifications);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <ProfileTabs
        profile={profiles}
        notifications={notifications || []}
        user={user}
      />
    </div>
  );
}
