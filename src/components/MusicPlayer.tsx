
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
      <audio ref={audioRef} />
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <img
            src={currentTrack?.image_url || "/placeholder.svg"}
            alt="Current Track"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-white">{currentTrack?.title || "No track selected"}</h4>
            <p className="text-sm text-gray-400">{currentTrack?.artist || "Select a track to play"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className={cn(
              "p-3 rounded-full bg-primary hover:bg-primary-hover transition-all duration-300",
              !currentTrack && "opacity-50 cursor-not-allowed"
            )}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button 
            className="text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            onClick={onNext}
            disabled={!onNext}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
