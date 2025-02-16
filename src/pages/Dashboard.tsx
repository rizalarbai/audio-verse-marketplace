
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MusicNFTForm } from "@/components/MusicNFTForm";
import { Plus } from "lucide-react";

interface WalletData {
  publicKey: string;
  secretKey: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<{ publicKey: string; balance: number } | null>(null);

  // Initialize Solana connection (using devnet for testing)
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const generateWallet = async () => {
    try {
      setLoading(true);
      
      // Generate new Solana keypair
      const newWallet = Keypair.generate();
      
      console.log("Generated new wallet with public key:", newWallet.publicKey.toString());
      
      // Convert secret key to string for storage
      const secretKeyString = JSON.stringify(Array.from(newWallet.secretKey));
      
      // Store wallet info in Supabase
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          user_id: user?.id,
          public_key: newWallet.publicKey.toString(),
          secret_key: secretKeyString, // Store as JSON string
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Wallet stored in Supabase, requesting airdrop...");

      // Request airdrop of 1 SOL (only works on devnet)
      const signature = await connection.requestAirdrop(
        newWallet.publicKey,
        LAMPORTS_PER_SOL // 1 SOL
      );
      
      console.log("Airdrop requested, confirming transaction...");
      
      // Confirm transaction
      await connection.confirmTransaction(signature);

      // Get wallet balance
      const balance = await connection.getBalance(newWallet.publicKey);

      console.log("Transaction confirmed, balance:", balance / LAMPORTS_PER_SOL);

      setWalletInfo({
        publicKey: newWallet.publicKey.toString(),
        balance: balance / LAMPORTS_PER_SOL,
      });

      toast.success("Wallet generated successfully!");
    } catch (error: any) {
      console.error("Detailed error generating wallet:", {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      toast.error(`Failed to generate wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select('public_key')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No wallet found
          return;
        }
        console.error("Error loading wallet:", error);
        throw error;
      }

      if (data) {
        const publicKey = new PublicKey(data.public_key);
        const balance = await connection.getBalance(publicKey);
        
        setWalletInfo({
          publicKey: data.public_key,
          balance: balance / LAMPORTS_PER_SOL,
        });
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-black">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AudioVerse</h1>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Profile Details Frame */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300">
                <span className="text-gray-400">Name:</span> {user?.user_metadata?.full_name || "Not Set"}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Email:</span> {user?.email}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Wallet Address:</span> {walletInfo?.publicKey || "No wallet generated"}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Wallet Balance:</span> {walletInfo ? `${walletInfo.balance} SOL` : "N/A"}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Point Balance:</span> 0 Points
              </p>
              {!walletInfo && (
                <Button onClick={generateWallet} disabled={loading}>
                  {loading ? "Generating..." : "Generate Wallet"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Artist List Frame */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Artist List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No artists registered yet</p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  New Artist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Music NFT Section */}
          {walletInfo && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Create Music NFT</h3>
              <MusicNFTForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
