
import { Home, Disc, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

export function FloatingNav() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Disc, label: 'Collection', path: '/dashboard' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <div 
      className={`${
        isMobile 
          ? 'fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 pb-safe'
          : 'fixed right-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm rounded-lg group hover:w-40 w-[52px]'
      } z-40 transition-all duration-300`}
    >
      <div className={`flex ${isMobile ? 'justify-around py-2 px-4' : 'flex-col gap-2 p-4'}`}>
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            className={`bg-primary/20 hover:bg-primary/40 text-white transition-all duration-300 w-full ${
              isMobile 
                ? 'flex flex-col items-center gap-1 p-1 text-xs'
                : 'flex items-center justify-start gap-2'
            }`}
            onClick={() => navigate(path)}
          >
            <Icon className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'} shrink-0`} />
            <span className={`text-sm whitespace-nowrap ${
              isMobile 
                ? 'block text-xs' 
                : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            }`}>
              {label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
