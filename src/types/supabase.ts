
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nfts: {
        Row: {
          id: string
          created_at: string
          title: string
          artist: string
          price: number
          image_url: string
          audio_url: string
          owner_id: string | null
          is_listed: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist: string
          price: number
          image_url: string
          audio_url: string
          owner_id?: string | null
          is_listed?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist?: string
          price?: number
          image_url?: string
          audio_url?: string
          owner_id?: string | null
          is_listed?: boolean
          metadata?: Json
        }
      }
      user_collections: {
        Row: {
          id: string
          created_at: string
          user_id: string
          nft_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          nft_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          nft_id?: string
        }
      }
    }
  }
}
