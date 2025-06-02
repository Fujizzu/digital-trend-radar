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
      brand_mentions: {
        Row: {
          brand_monitoring_id: string
          created_at: string
          id: string
          influence_score: number | null
          mention_context: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          trend_data_id: string
        }
        Insert: {
          brand_monitoring_id: string
          created_at?: string
          id?: string
          influence_score?: number | null
          mention_context?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          trend_data_id: string
        }
        Update: {
          brand_monitoring_id?: string
          created_at?: string
          id?: string
          influence_score?: number | null
          mention_context?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          trend_data_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_mentions_brand_monitoring_id_fkey"
            columns: ["brand_monitoring_id"]
            isOneToOne: false
            referencedRelation: "brand_monitoring"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_mentions_trend_data_id_fkey"
            columns: ["trend_data_id"]
            isOneToOne: false
            referencedRelation: "trend_data"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_monitoring: {
        Row: {
          brand_name: string
          created_at: string
          id: string
          is_active: boolean | null
          keywords: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_source_config: {
        Row: {
          api_endpoint: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          rate_limit_per_hour: number | null
          secret_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          rate_limit_per_hour?: number | null
          secret_name?: string | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          rate_limit_per_hour?: number | null
          secret_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"]
          updated_at?: string
        }
        Relationships: []
      }
      ingestion_metrics: {
        Row: {
          batch_timestamp: string
          error_details: Json | null
          id: string
          processing_duration_ms: number | null
          records_failed: number | null
          records_processed: number | null
          source_type: Database["public"]["Enums"]["data_source_type"]
        }
        Insert: {
          batch_timestamp?: string
          error_details?: Json | null
          id?: string
          processing_duration_ms?: number | null
          records_failed?: number | null
          records_processed?: number | null
          source_type: Database["public"]["Enums"]["data_source_type"]
        }
        Update: {
          batch_timestamp?: string
          error_details?: Json | null
          id?: string
          processing_duration_ms?: number | null
          records_failed?: number | null
          records_processed?: number | null
          source_type?: Database["public"]["Enums"]["data_source_type"]
        }
        Relationships: []
      }
      keywords: {
        Row: {
          category: string | null
          created_at: string
          id: string
          keyword: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          keyword: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          keyword?: string
        }
        Relationships: []
      }
      raw_data_ingestion: {
        Row: {
          created_at: string
          id: string
          ingested_at: string
          metadata: Json | null
          processed_at: string | null
          processing_status:
            | Database["public"]["Enums"]["processing_status"]
            | null
          raw_content: Json
          source_type: Database["public"]["Enums"]["data_source_type"]
          source_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ingested_at?: string
          metadata?: Json | null
          processed_at?: string | null
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          raw_content: Json
          source_type: Database["public"]["Enums"]["data_source_type"]
          source_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ingested_at?: string
          metadata?: Json | null
          processed_at?: string | null
          processing_status?:
            | Database["public"]["Enums"]["processing_status"]
            | null
          raw_content?: Json
          source_type?: Database["public"]["Enums"]["data_source_type"]
          source_url?: string | null
        }
        Relationships: []
      }
      trend_data: {
        Row: {
          confidence_score: number | null
          content_summary: string | null
          created_at: string
          engagement_metrics: Json | null
          id: string
          location_data: Json | null
          mention_count: number | null
          raw_data_id: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          timestamp_original: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          content_summary?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          location_data?: Json | null
          mention_count?: number | null
          raw_data_id?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source_type: Database["public"]["Enums"]["data_source_type"]
          timestamp_original: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          content_summary?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          id?: string
          location_data?: Json | null
          mention_count?: number | null
          raw_data_id?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source_type?: Database["public"]["Enums"]["data_source_type"]
          timestamp_original?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_data_raw_data_id_fkey"
            columns: ["raw_data_id"]
            isOneToOne: false
            referencedRelation: "raw_data_ingestion"
            referencedColumns: ["id"]
          },
        ]
      }
      trend_keywords: {
        Row: {
          id: string
          keyword_id: string
          relevance_score: number | null
          trend_data_id: string
        }
        Insert: {
          id?: string
          keyword_id: string
          relevance_score?: number | null
          trend_data_id: string
        }
        Update: {
          id?: string
          keyword_id?: string
          relevance_score?: number | null
          trend_data_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_keywords_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trend_keywords_trend_data_id_fkey"
            columns: ["trend_data_id"]
            isOneToOne: false
            referencedRelation: "trend_data"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          api_quota_remaining: number | null
          api_quota_reset_date: string | null
          company_name: string | null
          created_at: string
          id: string
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          api_quota_remaining?: number | null
          api_quota_reset_date?: string | null
          company_name?: string | null
          created_at?: string
          id: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          api_quota_remaining?: number | null
          api_quota_reset_date?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_trend_keywords: {
        Args: {
          trend_id: string
          keyword_list: string[]
          relevance_scores?: number[]
        }
        Returns: undefined
      }
      get_api_key: {
        Args: { source_name: Database["public"]["Enums"]["data_source_type"] }
        Returns: string
      }
    }
    Enums: {
      data_source_type:
        | "twitter"
        | "instagram"
        | "linkedin"
        | "reddit"
        | "youtube"
        | "news"
        | "google_trends"
      processing_status: "pending" | "processing" | "completed" | "failed"
      sentiment_type: "positive" | "negative" | "neutral"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      data_source_type: [
        "twitter",
        "instagram",
        "linkedin",
        "reddit",
        "youtube",
        "news",
        "google_trends",
      ],
      processing_status: ["pending", "processing", "completed", "failed"],
      sentiment_type: ["positive", "negative", "neutral"],
    },
  },
} as const
