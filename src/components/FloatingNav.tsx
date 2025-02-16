
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function FloatingNav() {
  const isMobile = useIsMobile();

  return (
    <div 
      className={`fixed z-50 flex gap-2 p-4 backdrop-blur-sm bg-black/20 rounded-lg transition-all duration-300 ${
        isMobile 
          ? 'bottom-4 left-1/2 -translate-x-1/2 flex-row'
          : 'right-4 top-1/2 -translate-y-1/2 flex-col'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="bg-primary/20 hover:bg-primary/40 text-white"
        onClick={() => window.location.href = '/'}
      >
        <Home className="h-5 w-5" />
      </Button>
    </div>
  );
}
