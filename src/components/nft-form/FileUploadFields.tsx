
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NFTFormValues } from "./types";

interface FileUploadFieldsProps {
  form: UseFormReturn<NFTFormValues>;
}

export function FileUploadFields({ form }: FileUploadFieldsProps) {
  return (
    <>
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
    </>
  );
}
