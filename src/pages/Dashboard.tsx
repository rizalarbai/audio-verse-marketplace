import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [nfts] = useState([]); // This will be replaced with actual NFT fetching logic

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-black pb-24">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Collection</h1>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {nfts.length === 0 ? (
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
              {/* NFT list will go here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
