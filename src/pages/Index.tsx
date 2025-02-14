
import { useState } from "react";
import NFTCard from "@/components/NFTCard";
import MusicPlayer from "@/components/MusicPlayer";
import { Wallet } from "lucide-react";
import { useNFTs } from "@/hooks/useNFTs";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [connected, setConnected] = useState(false);
  const { nfts, isLoading } = useNFTs();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-black flex items-center justify-center">
        <div className="text-white">Loading NFTs...</div>
      </div>
    );
  }

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
          {nfts?.map((nft) => (
            <div key={nft.id} className="animate-fade-in">
              <NFTCard
                title={nft.title}
                artist={nft.artist}
                image={nft.image_url}
                price={nft.price.toString()}
                onPlay={() => console.log(`Playing ${nft.title}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
