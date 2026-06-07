import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sidebarCookieState = (await cookies()).get("sidebar_state");
  return (
    <div className="min-h-full flex flex-col">
      <SidebarProvider defaultOpen={sidebarCookieState?.value !== "false"}>
        {children}
      </SidebarProvider>
    </div>
  );
}
