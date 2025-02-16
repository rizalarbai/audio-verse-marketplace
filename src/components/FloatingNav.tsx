
import { Home, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

export function FloatingNav() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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
        className={`bg-primary/20 hover:bg-primary/40 text-white group ${
          isMobile 
            ? 'flex flex-col items-center gap-1 p-2'
            : 'flex items-center gap-2'
        }`}
        onClick={() => navigate('/')}
      >
        <Home className={`${isMobile ? 'h-8 w-8' : 'h-5 w-5'}`} />
        <span className={`text-sm ${isMobile ? 'block' : 'hidden group-hover:block'}`}>
          Home
        </span>
      </Button>
      <Button
        variant="ghost"
        className={`bg-primary/20 hover:bg-primary/40 text-white group ${
          isMobile 
            ? 'flex flex-col items-center gap-1 p-2'
            : 'flex items-center gap-2'
        }`}
        onClick={() => navigate('/dashboard')}
      >
        <Grid className={`${isMobile ? 'h-8 w-8' : 'h-5 w-5'}`} />
        <span className={`text-sm ${isMobile ? 'block' : 'hidden group-hover:block'}`}>
          Collection
        </span>
      </Button>
    </div>
  );
}
