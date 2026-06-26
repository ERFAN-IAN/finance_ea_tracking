import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { CustomSidebar } from "@/components/layout/CustomSidebar";
import Navbar from "@/components/layout/Navbar";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarCookieState = (await cookies()).get("sidebar_state");
  return (
    <div className="min-h-full flex flex-col">
      <SidebarProvider defaultOpen={sidebarCookieState?.value !== "false"}>
        <CustomSidebar />
        <SidebarInset>
          <Navbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
