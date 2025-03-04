export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "MILIKI-nft_music": {
        Row: {
          artist: string
          cover_image_cid: string | null
          cover_image_url: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          is_listed: boolean
          metadata: Json
          music_file_cid: string | null
          music_file_url: string
          owner_id: string | null
          price: number | null
          title: string
          token_id: string | null
          updated_at: string
          wallet_id: string | null
        }
        Insert: {
          artist: string
          cover_image_cid?: string | null
          cover_image_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_listed?: boolean
          metadata?: Json
          music_file_cid?: string | null
          music_file_url: string
          owner_id?: string | null
          price?: number | null
          title: string
          token_id?: string | null
          updated_at?: string
          wallet_id?: string | null
        }
        Update: {
          artist?: string
          cover_image_cid?: string | null
          cover_image_url?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          is_listed?: boolean
          metadata?: Json
          music_file_cid?: string | null
          music_file_url?: string
          owner_id?: string | null
          price?: number | null
          title?: string
          token_id?: string | null
          updated_at?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MILIKI-nft_music_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "MILIKI-profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MILIKI-nft_music_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "MILIKI-profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MILIKI-nft_music_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "MILIKI-wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      "MILIKI-profiles": {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      "MILIKI-wallets": {
        Row: {
          address: string
          balance: number
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          balance?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          balance?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "MILIKI-wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "MILIKI-profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          artist: string
          audio_url: string
          created_at: string
          id: string
          image_url: string
          is_listed: boolean | null
          metadata: Json | null
          owner_id: string | null
          price: number
          title: string
        }
        Insert: {
          artist: string
          audio_url: string
          created_at: string
          id?: string
          image_url: string
          is_listed?: boolean | null
          metadata?: Json | null
          owner_id?: string | null
          price: number
          title: string
        }
        Update: {
          artist?: string
          audio_url?: string
          created_at?: string
          id?: string
          image_url?: string
          is_listed?: boolean | null
          metadata?: Json | null
          owner_id?: string | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          created_at: string
          id: string
          public_key: string | null
          secret_key: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          public_key?: string | null
          secret_key?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          public_key?: string | null
          secret_key?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
