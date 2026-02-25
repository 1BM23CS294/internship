
import { Logo } from '@/components/logo';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="flex items-center h-16 px-6 shrink-0 z-10 sticky top-0 bg-transparent">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Logo />
      </div>
    </header>
  );
}
