
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MusicNFTForm } from "@/components/MusicNFTForm";
import { FloatingNav } from "@/components/FloatingNav";

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
      <FloatingNav />
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AudioVerse</h1>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Profile</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Email: {user?.email}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Wallet</CardTitle>
                <CardDescription>Manage your Solana wallet</CardDescription>
              </CardHeader>
              <CardContent>
                {walletInfo ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Public Key</p>
                      <p className="text-gray-300 break-all">{walletInfo.publicKey}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Balance</p>
                      <p className="text-gray-300">{walletInfo.balance} SOL</p>
                    </div>
                  </div>
                ) : (
                  <Button onClick={generateWallet} disabled={loading}>
                    {loading ? "Generating..." : "Generate Wallet"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

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
