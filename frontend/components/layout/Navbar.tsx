import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
  return (
    <header className="flex h-16 items-center border-b px-4 justify-between">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
}

export default Navbar;
