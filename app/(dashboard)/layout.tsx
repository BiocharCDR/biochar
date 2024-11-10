import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SidebarHeader from "@/components/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { requireAuth } from "@/lib/supabase";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2  bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarHeader user={user} />
        </header>
        <main className="flex-1 px-5 py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

//  middleware matcher to ensure this layout is protected
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | GreenA",
  description: "GreenA dashboard and project management",
};
