
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { initializeWeb3Storage, uploadToIPFS } from "@/lib/web3storage";
import { useNFTs } from "@/hooks/useNFTs";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  artistName: z.string().min(1, "Artist name is required"),
  songTitle: z.string().min(1, "Song title is required"),
  songWriter: z.string().min(1, "Songwriter is required"),
  producer: z.string().min(1, "Producer name is required"),
  availableCopies: z.number().min(1, "Must mint at least 1 copy").max(10000, "Maximum 10,000 copies allowed"),
  audioFile: z.instanceof(File).refine((file) => {
    return file.type.startsWith('audio/');
  }, "Must be an audio file"),
  coverArt: z.instanceof(File).refine((file) => {
    return file.type.startsWith('image/');
  }, "Must be an image file"),
});

type FormValues = z.infer<typeof formSchema>;

export function MusicNFTForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createNFT } = useNFTs();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: "",
      songTitle: "",
      songWriter: "",
      producer: "",
      availableCopies: 1,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Please sign in to create NFTs");
      return;
    }

    try {
      setIsSubmitting(true);

      // Initialize web3.storage with your token
      initializeWeb3Storage(import.meta.env.VITE_WEB3_STORAGE_TOKEN);

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
        price: 0, // Initial price set to 0 since it's not listed yet
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
          <FormField
            control={form.control}
            name="artistName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Artist/Band Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter artist or band name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="songTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Song Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter song title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="songWriter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Song Writer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter songwriter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Producer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter producer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableCopies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Available Copies</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={10000}
                    placeholder="Enter number of copies" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Number of NFT copies to generate (1-10,000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audioFile"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="text-white">Audio File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Upload your audio file (MP3, WAV, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverArt"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="text-white">Cover Art</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Upload cover art (JPG, PNG, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
