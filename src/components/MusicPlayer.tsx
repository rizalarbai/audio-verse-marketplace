
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Track {
  title: string;
  artist: string;
  audio_url: string;
  image_url: string;
}

interface MusicPlayerProps {
  currentTrack?: Track;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer = ({ currentTrack, onNext, onPrevious }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audio_url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className={cn(
      "fixed left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20",
      isMobile ? "bottom-16 z-30" : "bottom-0 z-40"
    )}>
      <audio ref={audioRef} />
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center space-x-3">
          <img
            src={currentTrack?.image_url || "/placeholder.svg"}
            alt="Current Track"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-white text-sm">{currentTrack?.title || "No track selected"}</h4>
            <p className="text-xs text-gray-400">{currentTrack?.artist || "Select a track to play"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button 
            onClick={togglePlay}
            className={cn(
              "p-2 rounded-full bg-primary hover:bg-primary-hover transition-all duration-300",
              !currentTrack && "opacity-50 cursor-not-allowed"
            )}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={onNext}
            disabled={!onNext}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {!isMobile && (
          <div className="flex items-center space-x-3">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;
