import { AppSidebar } from "@/components/DashboardSidebar";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center border-b px-4">
          <SidebarTrigger />
        </header>

        <main className="p-6">hey all...sdsasadjnosadjisadiosadadsasd</main>
      </SidebarInset>
    </>
  );
}
