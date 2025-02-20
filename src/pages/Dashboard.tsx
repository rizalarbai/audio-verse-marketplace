
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNFTs } from "@/hooks/useNFTs";
import NFTCard from "@/components/NFTCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NFTSellForm } from "@/components/NFTSellForm";

const Dashboard = () => {
  const { user } = useAuth();
  const { nfts, isLoading } = useNFTs();

  const userNFTs = nfts?.filter(nft => nft.owner_id === user?.id) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-black pb-24">
        <div className="container mx-auto px-4 py-8">
          <p className="text-white">Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-black pb-24">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Collection</h1>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {userNFTs.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-400 text-center mb-4">
                  You don't have any NFTs in your collection yet.
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/account'}
                >
                  Create Your First NFT
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNFTs.map((nft) => (
                <div key={nft.id} className="relative group">
                  <NFTCard
                    title={nft.title}
                    artist={nft.artist}
                    image={nft.image_url}
                    price={nft.price.toString()}
                    onPlay={() => {}} // TODO: Implement play functionality
                  />
                  {!nft.is_listed && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="absolute top-4 right-4 bg-primary hover:bg-primary/90"
                          size="sm"
                        >
                          Sell NFT
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/95 border-white/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">List NFT for Sale</DialogTitle>
                        </DialogHeader>
                        <NFTSellForm 
                          nftId={nft.id}
                          onSuccess={() => {
                            // TODO: Implement refresh logic
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
