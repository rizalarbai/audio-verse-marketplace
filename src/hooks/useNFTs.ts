
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type NFT = Database['public']['Tables']['nfts']['Row']

export const useNFTs = () => {
  const queryClient = useQueryClient()

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const { mutate: createNFT } = useMutation({
    mutationFn: async (nft: Omit<Database['public']['Tables']['nfts']['Insert'], 'id' | 'created_at'>) => {
      // Generate a UUID for the NFT and current timestamp
      const id = crypto.randomUUID()
      const created_at = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('nfts')
        .insert({ ...nft, id, created_at })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
  })

  const { mutate: updateNFT } = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<NFT> & { id: string }) => {
      const { data, error } = await supabase
        .from('nfts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] })
    },
  })

  return {
    nfts,
    isLoading,
    createNFT,
    updateNFT,
  }
}
