import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/DashboardSidebar";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarCookieState = (await cookies()).get("sidebar_state");
  return (
    <div className="min-h-full flex flex-col">
      <SidebarProvider defaultOpen={sidebarCookieState?.value !== "false"}>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 items-center border-b px-4">
            <SidebarTrigger />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
