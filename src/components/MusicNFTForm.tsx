
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { initializeWeb3Storage, uploadToIPFS } from "@/lib/web3storage";
import { useNFTs } from "@/hooks/useNFTs";
import { useAuth } from "@/contexts/AuthContext";
import { ArtistInfoFields } from "./nft-form/ArtistInfoFields";
import { SongDetails } from "./nft-form/SongDetails";
import { FileUploadFields } from "./nft-form/FileUploadFields";
import { NFTFormValues, nftFormSchema } from "./nft-form/types";
import { supabase } from "@/lib/supabase";

export function MusicNFTForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNFT } = useNFTs();
  const { user } = useAuth();
  const [web3StorageToken, setWeb3StorageToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Try to fetch the Web3.storage API token instead of DID
        const { data: secretData, error: secretError } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'WEB3_STORAGE_TOKEN')
          .maybeSingle();

        if (secretError) {
          console.error('Error fetching Web3Storage token:', secretError);
          toast.error("Failed to load Web3Storage configuration");
          return;
        }

        if (!secretData) {
          console.error('Web3Storage token not found in secrets');
          toast.error("Web3Storage API token not found. Please set it in your Supabase secrets.");
          return;
        }

        console.log("Web3Storage token loaded successfully");
        setWeb3StorageToken(secretData.value);
      } catch (error) {
        console.error('Error in fetchToken:', error);
        toast.error("Failed to load Web3Storage configuration");
      }
    };

    fetchToken();
  }, []);

  const form = useForm<NFTFormValues>({
    resolver: zodResolver(nftFormSchema),
    defaultValues: {
      artistName: "",
      songTitle: "",
      songWriter: "",
      producer: "",
      availableCopies: 1,
    },
  });

  const onSubmit = async (data: NFTFormValues) => {
    if (!user) {
      toast.error("Please sign in to create NFTs");
      return;
    }

    if (!web3StorageToken) {
      toast.error("Web3Storage API token is not configured");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Initializing Web3Storage with API token...");
      initializeWeb3Storage(web3StorageToken);

      console.log("Preparing files for upload...");
      const files = [
        new File([data.audioFile], `${data.songTitle}-audio.${data.audioFile.name.split('.').pop()}`, {
          type: data.audioFile.type
        }),
        new File([data.coverArt], `${data.songTitle}-cover.${data.coverArt.name.split('.').pop()}`, {
          type: data.coverArt.type
        })
      ];

      console.log("Uploading files to IPFS...");
      const { urls: [audioUrl, imageUrl] } = await uploadToIPFS(files);
      console.log("Files uploaded successfully:", { audioUrl, imageUrl });

      console.log("Creating NFT in Supabase...");
      await createNFT({
        title: data.songTitle,
        artist: data.artistName,
        price: 0,
        image_url: imageUrl,
        audio_url: audioUrl,
        owner_id: user.id,
        is_listed: false,
        metadata: {
          songwriter: data.songWriter,
          producer: data.producer,
          availableCopies: data.availableCopies,
          totalCopies: data.availableCopies,
        }
      });

      toast.success("NFT created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating NFT:", error);
      toast.error(`Failed to create NFT: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ArtistInfoFields form={form} />
          <SongDetails form={form} />
          <FileUploadFields form={form} />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Creating NFT..." : "Create NFT"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
