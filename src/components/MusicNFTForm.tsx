
import { useState } from "react";
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

export function MusicNFTForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNFT } = useNFTs();
  const { user } = useAuth();

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

    try {
      setIsSubmitting(true);

      const did = import.meta.env.VITE_WEB3_STORAGE_DID;
      if (!did) {
        toast.error("Web3Storage DID token is not configured");
        return;
      }

      console.log("Initializing Web3Storage with DID:", did); // Debug log
      initializeWeb3Storage(did);

      // Prepare files for upload
      const files = [
        new File([data.audioFile], `${data.songTitle}-audio.${data.audioFile.name.split('.').pop()}`, {
          type: data.audioFile.type
        }),
        new File([data.coverArt], `${data.songTitle}-cover.${data.coverArt.name.split('.').pop()}`, {
          type: data.coverArt.type
        })
      ];

      // Upload to IPFS
      const { urls: [audioUrl, imageUrl] } = await uploadToIPFS(files);

      // Create NFT in Supabase
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
      toast.error("Failed to create NFT");
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
