
import { z } from "zod";

export const nftFormSchema = z.object({
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

export type NFTFormValues = z.infer<typeof nftFormSchema>;
