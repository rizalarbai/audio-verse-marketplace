
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NFTFormValues } from "./types";

interface SongDetailsProps {
  form: UseFormReturn<NFTFormValues>;
}

export function SongDetails({ form }: SongDetailsProps) {
  return (
    <>
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
    </>
  );
}
