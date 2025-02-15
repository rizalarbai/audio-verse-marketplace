
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const generateWallet = () => {
    // This is where we'll implement Solana wallet generation
    toast.info("Wallet generation coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-black">
      <header className="container mx-auto py-6 px-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AudioVerse</h1>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>
        
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
              <Button onClick={generateWallet}>Generate Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
