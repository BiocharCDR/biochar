"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";
import { ProfileForm } from "./profile-form";
import { NotificationSettings } from "./notification-settings";
import { SecuritySettings } from "./security-settings";

interface ProfileTabsProps {
  profile: any;
  notifications: any[];
  user: User;
}

export default function ProfileTabs({
  profile,
  notifications,
  user,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <ProfileForm initialData={profile} user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationSettings notifications={notifications} user={user} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecuritySettings user={user} />
      </TabsContent>
    </Tabs>
  );
}
