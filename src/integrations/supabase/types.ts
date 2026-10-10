export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_digests: {
        Row: {
          created_at: string
          html: string
          id: string
          issue_date: string
          markdown: string | null
          sent_at: string | null
          status: string
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          html: string
          id?: string
          issue_date: string
          markdown?: string | null
          sent_at?: string | null
          status?: string
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          html?: string
          id?: string
          issue_date?: string
          markdown?: string | null
          sent_at?: string | null
          status?: string
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      care_bot_logs: {
        Row: {
          assistant_reply: string | null
          created_at: string
          error: string | null
          id: string
          ip_hash: string | null
          latency_ms: number | null
          model: string | null
          session_id: string | null
          tool_titles: string[] | null
          turn_count: number | null
          user_agent: string | null
          user_message: string
        }
        Insert: {
          assistant_reply?: string | null
          created_at?: string
          error?: string | null
          id?: string
          ip_hash?: string | null
          latency_ms?: number | null
          model?: string | null
          session_id?: string | null
          tool_titles?: string[] | null
          turn_count?: number | null
          user_agent?: string | null
          user_message: string
        }
        Update: {
          assistant_reply?: string | null
          created_at?: string
          error?: string | null
          id?: string
          ip_hash?: string | null
          latency_ms?: number | null
          model?: string | null
          session_id?: string | null
          tool_titles?: string[] | null
          turn_count?: number | null
          user_agent?: string | null
          user_message?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          confirmed: boolean
          created_at: string
          email: string
          id: string
          last_sent_at: string | null
          name: string | null
          pref_music_videos: boolean
          pref_new_tools: boolean
          pref_weekly_digest: boolean
          source: string | null
          unsubscribe_token: string
          updated_at: string
        }
        Insert: {
          confirmed?: boolean
          created_at?: string
          email: string
          id?: string
          last_sent_at?: string | null
          name?: string | null
          pref_music_videos?: boolean
          pref_new_tools?: boolean
          pref_weekly_digest?: boolean
          source?: string | null
          unsubscribe_token?: string
          updated_at?: string
        }
        Update: {
          confirmed?: boolean
          created_at?: string
          email?: string
          id?: string
          last_sent_at?: string | null
          name?: string | null
          pref_music_videos?: boolean
          pref_new_tools?: boolean
          pref_weekly_digest?: boolean
          source?: string | null
          unsubscribe_token?: string
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          column_number: number | null
          component_stack: string | null
          created_at: string
          error_type: string
          id: string
          line_number: number | null
          message: string
          metadata: Json | null
          session_id: string | null
          severity: string
          source: string | null
          stack: string | null
          url: string | null
          user_agent: string | null
        }
        Insert: {
          column_number?: number | null
          component_stack?: string | null
          created_at?: string
          error_type: string
          id?: string
          line_number?: number | null
          message: string
          metadata?: Json | null
          session_id?: string | null
          severity?: string
          source?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Update: {
          column_number?: number | null
          component_stack?: string | null
          created_at?: string
          error_type?: string
          id?: string
          line_number?: number | null
          message?: string
          metadata?: Json | null
          session_id?: string | null
          severity?: string
          source?: string | null
          stack?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      gpt_app_prompts: {
        Row: {
          app_slug: string
          system_prompt: string
          updated_at: string
        }
        Insert: {
          app_slug: string
          system_prompt: string
          updated_at?: string
        }
        Update: {
          app_slug?: string
          system_prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gpt_app_prompts_app_slug_fkey"
            columns: ["app_slug"]
            isOneToOne: true
            referencedRelation: "gpt_apps"
            referencedColumns: ["slug"]
          },
        ]
      }
      gpt_apps: {
        Row: {
          created_at: string
          display_name: string
          greeting: string | null
          id: string
          image_url: string | null
          is_active: boolean
          model: string
          slug: string
          source_file: string | null
          starter_prompts: string[]
          supports_images: boolean
          tagline: string | null
          tool_title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          greeting?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          model?: string
          slug: string
          source_file?: string | null
          starter_prompts?: string[]
          supports_images?: boolean
          tagline?: string | null
          tool_title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          greeting?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          model?: string
          slug?: string
          source_file?: string | null
          starter_prompts?: string[]
          supports_images?: boolean
          tagline?: string | null
          tool_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gpt_chat_logs: {
        Row: {
          app_slug: string
          assistant_reply: string | null
          created_at: string
          error: string | null
          id: string
          image_requested: boolean
          image_succeeded: boolean
          is_guest: boolean
          latency_ms: number | null
          model: string | null
          prompt_chars: number
          reply_chars: number
          status: string
          turn_count: number
          user_id: string | null
          user_message: string | null
        }
        Insert: {
          app_slug: string
          assistant_reply?: string | null
          created_at?: string
          error?: string | null
          id?: string
          image_requested?: boolean
          image_succeeded?: boolean
          is_guest?: boolean
          latency_ms?: number | null
          model?: string | null
          prompt_chars?: number
          reply_chars?: number
          status?: string
          turn_count?: number
          user_id?: string | null
          user_message?: string | null
        }
        Update: {
          app_slug?: string
          assistant_reply?: string | null
          created_at?: string
          error?: string | null
          id?: string
          image_requested?: boolean
          image_succeeded?: boolean
          is_guest?: boolean
          latency_ms?: number | null
          model?: string | null
          prompt_chars?: number
          reply_chars?: number
          status?: string
          turn_count?: number
          user_id?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      gpt_conversations: {
        Row: {
          app_slug: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_slug: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_slug?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gpt_favorites: {
        Row: {
          app_slug: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          app_slug: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          app_slug?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gpt_guest_usage: {
        Row: {
          created_at: string
          guest_key: string
          id: string
          message_count: number
          updated_at: string
          usage_date: string
        }
        Insert: {
          created_at?: string
          guest_key: string
          id?: string
          message_count?: number
          updated_at?: string
          usage_date?: string
        }
        Update: {
          created_at?: string
          guest_key?: string
          id?: string
          message_count?: number
          updated_at?: string
          usage_date?: string
        }
        Relationships: []
      }
      gpt_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gpt_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "gpt_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      gpt_usage: {
        Row: {
          message_count: number
          updated_at: string
          usage_date: string
          user_id: string
        }
        Insert: {
          message_count?: number
          updated_at?: string
          usage_date?: string
          user_id: string
        }
        Update: {
          message_count?: number
          updated_at?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      link_health: {
        Row: {
          consecutive_failures: number
          created_at: string
          id: string
          last_checked_at: string | null
          last_error: string | null
          last_status_code: number | null
          reported_at: string | null
          status: string
          tool_category: string | null
          tool_title: string
          updated_at: string
          url: string
        }
        Insert: {
          consecutive_failures?: number
          created_at?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          last_status_code?: number | null
          reported_at?: string | null
          status?: string
          tool_category?: string | null
          tool_title: string
          updated_at?: string
          url: string
        }
        Update: {
          consecutive_failures?: number
          created_at?: string
          id?: string
          last_checked_at?: string | null
          last_error?: string | null
          last_status_code?: number | null
          reported_at?: string | null
          status?: string
          tool_category?: string | null
          tool_title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          pref_new_tools: boolean
          pref_weekly_digest: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          pref_new_tools?: boolean
          pref_weekly_digest?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          pref_new_tools?: boolean
          pref_weekly_digest?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      search_misses: {
        Row: {
          created_at: string
          hit_count: number
          id: string
          last_seen_at: string
          query: string
        }
        Insert: {
          created_at?: string
          hit_count?: number
          id?: string
          last_seen_at?: string
          query: string
        }
        Update: {
          created_at?: string
          hit_count?: number
          id?: string
          last_seen_at?: string
          query?: string
        }
        Relationships: []
      }
      tool_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          load_time_ms: number | null
          referrer: string | null
          session_id: string | null
          tool_category: string | null
          tool_title: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          load_time_ms?: number | null
          referrer?: string | null
          session_id?: string | null
          tool_category?: string | null
          tool_title: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          load_time_ms?: number | null
          referrer?: string | null
          session_id?: string | null
          tool_category?: string | null
          tool_title?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      tool_popularity: {
        Row: {
          clicks: number
          popularity: number
          tool_category: string
          tool_title: string
          updated_at: string
          views: number
        }
        Insert: {
          clicks?: number
          popularity?: number
          tool_category?: string
          tool_title: string
          updated_at?: string
          views?: number
        }
        Update: {
          clicks?: number
          popularity?: number
          tool_category?: string
          tool_title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      tool_reviews: {
        Row: {
          author_name: string
          avatar_seed: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          session_id: string | null
          tool_slug: string
          tool_title: string
        }
        Insert: {
          author_name?: string
          avatar_seed?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          session_id?: string | null
          tool_slug: string
          tool_title: string
        }
        Update: {
          author_name?: string
          avatar_seed?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          session_id?: string | null
          tool_slug?: string
          tool_title?: string
        }
        Relationships: []
      }
      tool_submissions: {
        Row: {
          admin_notes: string | null
          ai_safety_reason: string | null
          ai_safety_score: number | null
          ai_safety_verdict: string | null
          category: string
          description: string
          id: string
          image_storage_path: string | null
          image_url: string | null
          name: string
          published_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string | null
          status: string
          submitted_at: string
          submitter_email: string
          submitter_name: string | null
          submitter_user_id: string | null
          url: string
          video_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          ai_safety_reason?: string | null
          ai_safety_score?: number | null
          ai_safety_verdict?: string | null
          category: string
          description: string
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name: string
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string | null
          status?: string
          submitted_at?: string
          submitter_email: string
          submitter_name?: string | null
          submitter_user_id?: string | null
          url: string
          video_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          ai_safety_reason?: string | null
          ai_safety_score?: number | null
          ai_safety_verdict?: string | null
          category?: string
          description?: string
          id?: string
          image_storage_path?: string | null
          image_url?: string | null
          name?: string
          published_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string | null
          status?: string
          submitted_at?: string
          submitter_email?: string
          submitter_name?: string | null
          submitter_user_id?: string | null
          url?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      approved_tool_submissions: {
        Row: {
          ai_safety_score: number | null
          ai_safety_verdict: string | null
          category: string | null
          description: string | null
          id: string | null
          image_url: string | null
          name: string | null
          published_at: string | null
          slug: string | null
          submitted_at: string | null
          submitter_name: string | null
          url: string | null
          video_url: string | null
        }
        Insert: {
          ai_safety_score?: number | null
          ai_safety_verdict?: string | null
          category?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          published_at?: string | null
          slug?: string | null
          submitted_at?: string | null
          submitter_name?: string | null
          url?: string | null
          video_url?: string | null
        }
        Update: {
          ai_safety_score?: number | null
          ai_safety_verdict?: string | null
          category?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          published_at?: string | null
          slug?: string | null
          submitted_at?: string | null
          submitter_name?: string | null
          url?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_tool_popularity_stats: {
        Args: never
        Returns: {
          avg_load_time_ms: number
          last_interaction: string
          search_appearances: number
          tool_category: string
          tool_title: string
          total_clicks: number
          total_views: number
          unique_sessions: number
        }[]
      }
      get_tool_review_summary: {
        Args: { _tool_slug: string }
        Returns: {
          average_rating: number
          review_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
