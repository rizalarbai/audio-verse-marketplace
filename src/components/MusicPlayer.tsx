
import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src="/placeholder.svg"
            alt="Current Track"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium">Track Name</h4>
            <p className="text-sm text-gray-500">Artist Name</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-primary transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-primary hover:bg-primary-hover transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button className="text-gray-600 hover:text-primary transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <Volume2 className="w-5 h-5 text-gray-600" />
          <div className="w-24 h-1 bg-gray-200 rounded-full">
            <div className="w-1/2 h-full bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
