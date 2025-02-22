
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NFTFormValues } from "./types";

interface ArtistInfoFieldsProps {
  form: UseFormReturn<NFTFormValues>;
}

export function ArtistInfoFields({ form }: ArtistInfoFieldsProps) {
  return (
    <>
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
    </>
  );
}
