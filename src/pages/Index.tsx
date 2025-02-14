
import { useState, useEffect } from "react";
import NFTCard from "@/components/NFTCard";
import MusicPlayer from "@/components/MusicPlayer";
import { Wallet } from "lucide-react";
import { useNFTs } from "@/hooks/useNFTs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Index = () => {
  const [connected, setConnected] = useState(false);
  const { nfts, isLoading, createNFT } = useNFTs();
  const queryClient = useQueryClient();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  const createSampleNFTs = async () => {
    const sampleNFTs = [
      {
        title: "Cosmic Harmony",
        artist: "Stellar Beats",
        price: 2.5,
        image_url: "https://images.unsplash.com/photo-1614149162883-504ce4d13909",
        audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
        is_listed: true,
        metadata: { genre: "Electronic", duration: "3:45" }
      },
      {
        title: "Desert Nights",
        artist: "Oasis Dreams",
        price: 1.8,
        image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
        is_listed: true,
        metadata: { genre: "Ambient", duration: "4:20" }
      },
      {
        title: "Urban Pulse",
        artist: "City Soundscape",
        price: 3.2,
        image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        audio_url: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
        is_listed: true,
        metadata: { genre: "Hip Hop", duration: "2:55" }
      }
    ];

    try {
      for (const nft of sampleNFTs) {
        await createNFT(nft);
      }
      toast.success("Sample NFTs created successfully!");
    } catch (error) {
      console.error("Error creating sample NFTs:", error);
      toast.error("Failed to create sample NFTs");
    }
  };

  useEffect(() => {
    if (!nfts || nfts.length === 0) {
      createSampleNFTs();
    }
  }, [nfts]);

  const handlePlayTrack = (index: number) => {
    setCurrentTrackIndex(index);
  };

  const handleNextTrack = () => {
    if (nfts && currentTrackIndex < nfts.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-black flex items-center justify-center">
        <div className="text-white">Loading NFTs...</div>
      </div>
    );
  }

  const currentTrack = nfts && currentTrackIndex >= 0 ? nfts[currentTrackIndex] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-black">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AudioVerse</h1>
          <button
            onClick={() => setConnected(!connected)}
            className="premium-button flex items-center space-x-2"
          >
            <Wallet className="w-5 h-5" />
            <span>{connected ? "Connected" : "Connect Wallet"}</span>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center animate-fade-in-slow">
        <h2 className="text-5xl font-bold text-white mb-6">
          Discover & Collect Rare Music NFTs
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Own unique pieces of music history on the Solana blockchain.
          Buy, sell, and listen to exclusive tracks from your favorite artists.
        </p>
      </section>

      {/* NFT Grid */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-2xl font-semibold text-white mb-8">Featured NFTs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts?.map((nft, index) => (
            <div key={nft.id} className="animate-fade-in">
              <NFTCard
                title={nft.title}
                artist={nft.artist}
                image={nft.image_url}
                price={nft.price.toString()}
                onPlay={() => handlePlayTrack(index)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Music Player */}
      <MusicPlayer 
        currentTrack={currentTrack}
        onNext={currentTrackIndex < (nfts?.length || 0) - 1 ? handleNextTrack : undefined}
        onPrevious={currentTrackIndex > 0 ? handlePreviousTrack : undefined}
      />
    </div>
  );
};

export default Index;
