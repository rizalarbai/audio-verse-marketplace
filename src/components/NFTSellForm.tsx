
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  price: z.string().min(1, "Price is required"),
  royalties: z.string().min(1, "Please select royalties percentage"),
  purchaseLimit: z.string().min(1, "Purchase limit is required"),
});

interface NFTSellFormProps {
  nftId: string;
  onSuccess: () => void;
}

export function NFTSellForm({ nftId, onSuccess }: NFTSellFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "",
      royalties: "5",
      purchaseLimit: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // TODO: Implement the actual NFT listing logic here
      console.log("Listing NFT with values:", values);
      toast.success("NFT listed successfully!");
      onSuccess();
    } catch (error) {
      console.error("Error listing NFT:", error);
      toast.error("Failed to list NFT");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Price (SOL)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price in SOL"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Set the price for each copy of your NFT
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="royalties"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Royalties</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/10">
                    <SelectValue placeholder="Select royalty percentage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[0, 1, 5, 8, 10, 15].map((percentage) => (
                    <SelectItem key={percentage} value={percentage.toString()}>
                      {percentage}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-400">
                Percentage you'll receive from secondary sales
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Purchase Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  placeholder="Maximum copies per wallet"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                Maximum number of copies a single wallet can purchase
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          List NFT for Sale
        </Button>
      </form>
    </Form>
  );
}
