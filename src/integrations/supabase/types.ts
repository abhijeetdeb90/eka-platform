export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      ai_insights: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          kind: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          kind: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          created_at: string;
          event: string;
          id: string;
          props: Json;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event: string;
          id?: string;
          props?: Json;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event?: string;
          id?: string;
          props?: Json;
          user_id?: string | null;
        };
        Relationships: [];
      };
      billing_events: {
        Row: {
          created_at: string;
          error: string | null;
          event_id: string;
          id: string;
          payload: Json;
          processed_at: string | null;
          provider: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          error?: string | null;
          event_id: string;
          id?: string;
          payload?: Json;
          processed_at?: string | null;
          provider?: string;
          type: string;
        };
        Update: {
          created_at?: string;
          error?: string | null;
          event_id?: string;
          id?: string;
          payload?: Json;
          processed_at?: string | null;
          provider?: string;
          type?: string;
        };
        Relationships: [];
      };
      campaign_days: {
        Row: {
          action: string;
          campaign_id: string;
          created_at: string;
          cta: string;
          day_number: number;
          id: string;
          minutes: number;
          promise: string;
          route: string;
          title: string;
          tokens: number;
        };
        Insert: {
          action?: string;
          campaign_id: string;
          created_at?: string;
          cta?: string;
          day_number: number;
          id?: string;
          minutes?: number;
          promise?: string;
          route?: string;
          title: string;
          tokens?: number;
        };
        Update: {
          action?: string;
          campaign_id?: string;
          created_at?: string;
          cta?: string;
          day_number?: number;
          id?: string;
          minutes?: number;
          promise?: string;
          route?: string;
          title?: string;
          tokens?: number;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_days_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_progress: {
        Row: {
          campaign_id: string;
          completed_on: string;
          created_at: string;
          day_number: number;
          id: string;
          note: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          campaign_id: string;
          completed_on?: string;
          created_at?: string;
          day_number: number;
          id?: string;
          note?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          campaign_id?: string;
          completed_on?: string;
          created_at?: string;
          day_number?: number;
          id?: string;
          note?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_progress_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      campaigns: {
        Row: {
          active: boolean;
          created_at: string;
          day_count: number;
          id: string;
          promise: string;
          slug: string;
          sort_order: number;
          tagline: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          day_count?: number;
          id?: string;
          promise?: string;
          slug: string;
          sort_order?: number;
          tagline?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          day_count?: number;
          id?: string;
          promise?: string;
          slug?: string;
          sort_order?: number;
          tagline?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cancellation_surveys: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          outcome: string;
          reason: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          outcome?: string;
          reason: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          outcome?: string;
          reason?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      circle_activities: {
        Row: {
          body: string;
          capacity: number | null;
          closed: boolean;
          community_id: string;
          created_at: string;
          created_by: string;
          id: string;
          kind: string;
          requires_approval: boolean;
          starts_at: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          body: string;
          capacity?: number | null;
          closed?: boolean;
          community_id: string;
          created_at?: string;
          created_by: string;
          id?: string;
          kind: string;
          requires_approval?: boolean;
          starts_at?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          capacity?: number | null;
          closed?: boolean;
          community_id?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          kind?: string;
          requires_approval?: boolean;
          starts_at?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "circle_activities_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      circle_activity_joins: {
        Row: {
          activity_id: string;
          attended: boolean;
          created_at: string;
          decided_at: string | null;
          id: string;
          note: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          activity_id: string;
          attended?: boolean;
          created_at?: string;
          decided_at?: string | null;
          id?: string;
          note?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          activity_id?: string;
          attended?: boolean;
          created_at?: string;
          decided_at?: string | null;
          id?: string;
          note?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "circle_activity_joins_activity_id_fkey";
            columns: ["activity_id"];
            isOneToOne: false;
            referencedRelation: "circle_activities";
            referencedColumns: ["id"];
          },
        ];
      };
      communities: {
        Row: {
          category: string;
          cover_image: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          featured: boolean;
          id: string;
          member_count: number;
          name: string;
          rules: string | null;
          slug: string;
        };
        Insert: {
          category?: string;
          cover_image?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          featured?: boolean;
          id?: string;
          member_count?: number;
          name: string;
          rules?: string | null;
          slug: string;
        };
        Update: {
          category?: string;
          cover_image?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          featured?: boolean;
          id?: string;
          member_count?: number;
          name?: string;
          rules?: string | null;
          slug?: string;
        };
        Relationships: [];
      };
      community_members: {
        Row: {
          community_id: string;
          created_at: string;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          community_id: string;
          created_at?: string;
          id?: string;
          role?: string;
          user_id: string;
        };
        Update: {
          community_id?: string;
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      content_appeals: {
        Row: {
          created_at: string;
          id: string;
          outcome: string | null;
          outcome_note: string | null;
          reason_code: string;
          report_id: string | null;
          restriction_id: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          statement: string;
          status: string;
          subject_id: string | null;
          subject_kind: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          outcome?: string | null;
          outcome_note?: string | null;
          reason_code: string;
          report_id?: string | null;
          restriction_id?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          statement: string;
          status?: string;
          subject_id?: string | null;
          subject_kind: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          outcome?: string | null;
          outcome_note?: string | null;
          reason_code?: string;
          report_id?: string | null;
          restriction_id?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          statement?: string;
          status?: string;
          subject_id?: string | null;
          subject_kind?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_appeals_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "content_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_appeals_restriction_id_fkey";
            columns: ["restriction_id"];
            isOneToOne: false;
            referencedRelation: "user_restrictions";
            referencedColumns: ["id"];
          },
        ];
      };
      content_reactions: {
        Row: {
          created_at: string;
          id: string;
          reaction: string;
          target_id: string;
          target_kind: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          reaction: string;
          target_id: string;
          target_kind: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          reaction?: string;
          target_id?: string;
          target_kind?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      content_reports: {
        Row: {
          auto_hidden: boolean;
          comment_id: string | null;
          created_at: string;
          details: string | null;
          id: string;
          post_id: string | null;
          reason: string;
          reported_user_id: string | null;
          reporter_id: string;
          resolution: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          severity: string;
          status: string;
          target_id: string | null;
          target_kind: string;
        };
        Insert: {
          auto_hidden?: boolean;
          comment_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          post_id?: string | null;
          reason: string;
          reported_user_id?: string | null;
          reporter_id: string;
          resolution?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          severity?: string;
          status?: string;
          target_id?: string | null;
          target_kind?: string;
        };
        Update: {
          auto_hidden?: boolean;
          comment_id?: string | null;
          created_at?: string;
          details?: string | null;
          id?: string;
          post_id?: string | null;
          reason?: string;
          reported_user_id?: string | null;
          reporter_id?: string;
          resolution?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          severity?: string;
          status?: string;
          target_id?: string | null;
          target_kind?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_reports_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "post_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_reports_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      countries: {
        Row: {
          code: string;
          created_at: string;
          name: string;
          slug: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          name: string;
          slug: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      creator_pool_periods: {
        Row: {
          created_at: string;
          created_by: string | null;
          currency: string;
          funding_source: string;
          id: string;
          period: string;
          pool_cents: number;
          published_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          funding_source?: string;
          id?: string;
          period: string;
          pool_cents?: number;
          published_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          funding_source?: string;
          id?: string;
          period?: string;
          pool_cents?: number;
          published_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      creator_score_events: {
        Row: {
          component: string;
          created_at: string;
          delta: number;
          id: string;
          reason: string;
          user_id: string;
        };
        Insert: {
          component: string;
          created_at?: string;
          delta?: number;
          id?: string;
          reason: string;
          user_id: string;
        };
        Update: {
          component?: string;
          created_at?: string;
          delta?: number;
          id?: string;
          reason?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      creator_score_snapshots: {
        Row: {
          created_at: string;
          dimensions: Json;
          id: string;
          total: number;
          user_id: string;
          weights: Json;
        };
        Insert: {
          created_at?: string;
          dimensions?: Json;
          id?: string;
          total?: number;
          user_id: string;
          weights?: Json;
        };
        Update: {
          created_at?: string;
          dimensions?: Json;
          id?: string;
          total?: number;
          user_id?: string;
          weights?: Json;
        };
        Relationships: [];
      };
      creator_scores: {
        Row: {
          completion: number;
          cross_tradition: number;
          live_attendance: number;
          penalties: number;
          reactions: number;
          saves: number;
          score: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completion?: number;
          cross_tradition?: number;
          live_attendance?: number;
          penalties?: number;
          reactions?: number;
          saves?: number;
          score?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completion?: number;
          cross_tradition?: number;
          live_attendance?: number;
          penalties?: number;
          reactions?: number;
          saves?: number;
          score?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      cultural_items: {
        Row: {
          body: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          image_url: string | null;
          is_demo: boolean;
          kind: string;
          name: string;
          place_id: string | null;
          provenance: string;
          region_id: string | null;
          slug: string;
          source_id: string | null;
          status: string;
          summary: string;
          tradition: string | null;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          is_demo?: boolean;
          kind: string;
          name: string;
          place_id?: string | null;
          provenance?: string;
          region_id?: string | null;
          slug: string;
          source_id?: string | null;
          status?: string;
          summary?: string;
          tradition?: string | null;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          is_demo?: boolean;
          kind?: string;
          name?: string;
          place_id?: string | null;
          provenance?: string;
          region_id?: string | null;
          slug?: string;
          source_id?: string | null;
          status?: string;
          summary?: string;
          tradition?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cultural_items_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cultural_items_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cultural_items_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cultural_items_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_prompts: {
        Row: {
          action: string;
          body: string;
          created_at: string;
          id: string;
          kind: string;
          minutes: number;
          theme: string;
          title: string;
        };
        Insert: {
          action?: string;
          body: string;
          created_at?: string;
          id?: string;
          kind?: string;
          minutes?: number;
          theme?: string;
          title: string;
        };
        Update: {
          action?: string;
          body?: string;
          created_at?: string;
          id?: string;
          kind?: string;
          minutes?: number;
          theme?: string;
          title?: string;
        };
        Relationships: [];
      };
      episode_chapters: {
        Row: {
          episode_id: string;
          id: string;
          label: string;
          starts_seconds: number;
        };
        Insert: {
          episode_id: string;
          id?: string;
          label: string;
          starts_seconds?: number;
        };
        Update: {
          episode_id?: string;
          id?: string;
          label?: string;
          starts_seconds?: number;
        };
        Relationships: [
          {
            foreignKeyName: "episode_chapters_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_comments: {
        Row: {
          body: string;
          created_at: string;
          episode_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          episode_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          episode_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episode_comments_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_follows: {
        Row: {
          created_at: string;
          episode_id: string;
          id: string;
          notify_questions: boolean;
          notify_schedule: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          episode_id: string;
          id?: string;
          notify_questions?: boolean;
          notify_schedule?: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string;
          episode_id?: string;
          id?: string;
          notify_questions?: boolean;
          notify_schedule?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episode_follows_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_purchases: {
        Row: {
          amount_cents: number;
          created_at: string;
          episode_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          episode_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          episode_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episode_purchases_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_question_votes: {
        Row: {
          created_at: string;
          id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          question_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episode_question_votes_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "episode_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_questions: {
        Row: {
          answer_note: string | null;
          answered: boolean;
          body: string;
          created_at: string;
          episode_id: string;
          hidden: boolean;
          id: string;
          pinned: boolean;
          updated_at: string;
          user_id: string;
          vote_count: number;
        };
        Insert: {
          answer_note?: string | null;
          answered?: boolean;
          body: string;
          created_at?: string;
          episode_id: string;
          hidden?: boolean;
          id?: string;
          pinned?: boolean;
          updated_at?: string;
          user_id: string;
          vote_count?: number;
        };
        Update: {
          answer_note?: string | null;
          answered?: boolean;
          body?: string;
          created_at?: string;
          episode_id?: string;
          hidden?: boolean;
          id?: string;
          pinned?: boolean;
          updated_at?: string;
          user_id?: string;
          vote_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "episode_questions_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episode_rsvps: {
        Row: {
          created_at: string;
          episode_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          episode_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          episode_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "episode_rsvps_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      episodes: {
        Row: {
          cover_url: string | null;
          created_at: string;
          creator_id: string;
          description: string;
          duration_minutes: number;
          id: string;
          media_kind: string;
          media_url: string | null;
          price_cents: number;
          published: boolean;
          scheduled_at: string | null;
          title: string;
          topic_slug: string | null;
          tradition: string;
        };
        Insert: {
          cover_url?: string | null;
          created_at?: string;
          creator_id: string;
          description: string;
          duration_minutes?: number;
          id?: string;
          media_kind?: string;
          media_url?: string | null;
          price_cents?: number;
          published?: boolean;
          scheduled_at?: string | null;
          title: string;
          topic_slug?: string | null;
          tradition?: string;
        };
        Update: {
          cover_url?: string | null;
          created_at?: string;
          creator_id?: string;
          description?: string;
          duration_minutes?: number;
          id?: string;
          media_kind?: string;
          media_url?: string | null;
          price_cents?: number;
          published?: boolean;
          scheduled_at?: string | null;
          title?: string;
          topic_slug?: string | null;
          tradition?: string;
        };
        Relationships: [];
      };
      explore_sections: {
        Row: {
          body: string;
          heading: string;
          id: string;
          sort_order: number;
          topic_id: string;
        };
        Insert: {
          body: string;
          heading: string;
          id?: string;
          sort_order?: number;
          topic_id: string;
        };
        Update: {
          body?: string;
          heading?: string;
          id?: string;
          sort_order?: number;
          topic_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "explore_sections_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "explore_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      explore_topics: {
        Row: {
          created_at: string;
          id: string;
          kind: string;
          origin: string | null;
          slug: string;
          sort_order: number;
          summary: string;
          title: string;
          tradition: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind?: string;
          origin?: string | null;
          slug: string;
          sort_order?: number;
          summary: string;
          title: string;
          tradition: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: string;
          origin?: string | null;
          slug?: string;
          sort_order?: number;
          summary?: string;
          title?: string;
          tradition?: string;
        };
        Relationships: [];
      };
      fasting_logs: {
        Row: {
          created_at: string;
          ended_at: string | null;
          id: string;
          label: string;
          observance_id: string | null;
          started_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          label?: string;
          observance_id?: string | null;
          started_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          ended_at?: string | null;
          id?: string;
          label?: string;
          observance_id?: string | null;
          started_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fasting_logs_observance_id_fkey";
            columns: ["observance_id"];
            isOneToOne: false;
            referencedRelation: "observances";
            referencedColumns: ["id"];
          },
        ];
      };
      finance_distributions: {
        Row: {
          amount_cents: number;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          id: string;
          kind: string;
          note: string | null;
          payment_date: string | null;
          period: string;
          recipient_id: string | null;
          recipient_name: string | null;
          recorded_by: string | null;
          reference: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          id?: string;
          kind: string;
          note?: string | null;
          payment_date?: string | null;
          period: string;
          recipient_id?: string | null;
          recipient_name?: string | null;
          recorded_by?: string | null;
          reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          id?: string;
          kind?: string;
          note?: string | null;
          payment_date?: string | null;
          period?: string;
          recipient_id?: string | null;
          recipient_name?: string | null;
          recorded_by?: string | null;
          reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      finance_expenses: {
        Row: {
          amount_cents: number;
          bucket: string;
          category: string;
          created_at: string;
          id: string;
          note: string | null;
          payment_date: string | null;
          period: string;
          recorded_by: string | null;
          reference: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          bucket?: string;
          category: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          payment_date?: string | null;
          period: string;
          recorded_by?: string | null;
          reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          bucket?: string;
          category?: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          payment_date?: string | null;
          period?: string;
          recorded_by?: string | null;
          reference?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      finance_periods: {
        Row: {
          cash_balance_cents: number;
          closed: boolean;
          closed_at: string | null;
          closed_by: string | null;
          created_at: string;
          id: string;
          note: string | null;
          period: string;
          updated_at: string;
        };
        Insert: {
          cash_balance_cents?: number;
          closed?: boolean;
          closed_at?: string | null;
          closed_by?: string | null;
          created_at?: string;
          id?: string;
          note?: string | null;
          period: string;
          updated_at?: string;
        };
        Update: {
          cash_balance_cents?: number;
          closed?: boolean;
          closed_at?: string | null;
          closed_by?: string | null;
          created_at?: string;
          id?: string;
          note?: string | null;
          period?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          created_at: string;
          follower_id: string;
          following_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          follower_id: string;
          following_id: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          follower_id?: string;
          following_id?: string;
          id?: string;
        };
        Relationships: [];
      };
      fund_allocations: {
        Row: {
          amount_cents: number;
          category: string;
          created_at: string;
          creator_id: string | null;
          id: string;
          period: string;
          pool_cents: number;
          status: string;
        };
        Insert: {
          amount_cents?: number;
          category?: string;
          created_at?: string;
          creator_id?: string | null;
          id?: string;
          period: string;
          pool_cents?: number;
          status?: string;
        };
        Update: {
          amount_cents?: number;
          category?: string;
          created_at?: string;
          creator_id?: string | null;
          id?: string;
          period?: string;
          pool_cents?: number;
          status?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          mood: string | null;
          tags: string[];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          mood?: string | null;
          tags?: string[];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          mood?: string | null;
          tags?: string[];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      journey_day_logs: {
        Row: {
          completed_on: string;
          created_at: string;
          day_number: number;
          id: string;
          journey_id: string;
          reflection: string;
          user_id: string;
        };
        Insert: {
          completed_on?: string;
          created_at?: string;
          day_number: number;
          id?: string;
          journey_id: string;
          reflection?: string;
          user_id: string;
        };
        Update: {
          completed_on?: string;
          created_at?: string;
          day_number?: number;
          id?: string;
          journey_id?: string;
          reflection?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journey_day_logs_journey_id_fkey";
            columns: ["journey_id"];
            isOneToOne: false;
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      journey_days: {
        Row: {
          arc_day: number;
          id: string;
          journey_id: string;
          minutes: number;
          practice: string;
          reflection: string;
          title: string;
        };
        Insert: {
          arc_day: number;
          id?: string;
          journey_id: string;
          minutes?: number;
          practice: string;
          reflection: string;
          title: string;
        };
        Update: {
          arc_day?: number;
          id?: string;
          journey_id?: string;
          minutes?: number;
          practice?: string;
          reflection?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journey_days_journey_id_fkey";
            columns: ["journey_id"];
            isOneToOne: false;
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      journey_enrollments: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          journey_id: string;
          started_on: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          journey_id: string;
          started_on?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          journey_id?: string;
          started_on?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journey_enrollments_journey_id_fkey";
            columns: ["journey_id"];
            isOneToOne: false;
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      journeys: {
        Row: {
          created_at: string;
          duration_days: number;
          id: string;
          pillar: string;
          promise: string;
          slug: string;
          sort_order: number;
          summary: string;
          theme: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          duration_days: number;
          id?: string;
          pillar?: string;
          promise?: string;
          slug: string;
          sort_order?: number;
          summary?: string;
          theme?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          duration_days?: number;
          id?: string;
          pillar?: string;
          promise?: string;
          slug?: string;
          sort_order?: number;
          summary?: string;
          theme?: string;
          title?: string;
        };
        Relationships: [];
      };
      ledger_entries: {
        Row: {
          category: string;
          chargeback_amount: number;
          community_allocation: number;
          config_snapshot: Json | null;
          created_at: string;
          creator_id: string | null;
          creator_net_amount: number;
          creator_pool_allocation: number;
          currency: string;
          eka_gross_fee: number;
          entry_kind: string;
          gross_creator_amount: number;
          id: string;
          is_test_transaction: boolean;
          member_id: string | null;
          note: string | null;
          operations_allocation: number;
          payment_processing_cost: number;
          peace_knowledge_allocation: number;
          platform_fee_percentage: number;
          refund_amount: number;
          retained_earnings_allocation: number;
          reverses_id: string | null;
          settled_at: string | null;
          status: string;
          transaction_ref: string | null;
          trust_safety_allocation: number;
        };
        Insert: {
          category?: string;
          chargeback_amount?: number;
          community_allocation?: number;
          config_snapshot?: Json | null;
          created_at?: string;
          creator_id?: string | null;
          creator_net_amount?: number;
          creator_pool_allocation?: number;
          currency?: string;
          eka_gross_fee?: number;
          entry_kind?: string;
          gross_creator_amount?: number;
          id?: string;
          is_test_transaction?: boolean;
          member_id?: string | null;
          note?: string | null;
          operations_allocation?: number;
          payment_processing_cost?: number;
          peace_knowledge_allocation?: number;
          platform_fee_percentage?: number;
          refund_amount?: number;
          retained_earnings_allocation?: number;
          reverses_id?: string | null;
          settled_at?: string | null;
          status?: string;
          transaction_ref?: string | null;
          trust_safety_allocation?: number;
        };
        Update: {
          category?: string;
          chargeback_amount?: number;
          community_allocation?: number;
          config_snapshot?: Json | null;
          created_at?: string;
          creator_id?: string | null;
          creator_net_amount?: number;
          creator_pool_allocation?: number;
          currency?: string;
          eka_gross_fee?: number;
          entry_kind?: string;
          gross_creator_amount?: number;
          id?: string;
          is_test_transaction?: boolean;
          member_id?: string | null;
          note?: string | null;
          operations_allocation?: number;
          payment_processing_cost?: number;
          peace_knowledge_allocation?: number;
          platform_fee_percentage?: number;
          refund_amount?: number;
          retained_earnings_allocation?: number;
          reverses_id?: string | null;
          settled_at?: string | null;
          status?: string;
          transaction_ref?: string | null;
          trust_safety_allocation?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ledger_entries_reverses_id_fkey";
            columns: ["reverses_id"];
            isOneToOne: false;
            referencedRelation: "ledger_entries";
            referencedColumns: ["id"];
          },
        ];
      };
      marketplace_bookings: {
        Row: {
          created_at: string;
          duration_minutes: number;
          fee_cents: number;
          id: string;
          join_url: string | null;
          note: string | null;
          package_id: string | null;
          package_title: string;
          payout_cents: number;
          practitioner_id: string;
          price_cents: number;
          seeker_id: string;
          slot_id: string | null;
          starts_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          duration_minutes?: number;
          fee_cents: number;
          id?: string;
          join_url?: string | null;
          note?: string | null;
          package_id?: string | null;
          package_title: string;
          payout_cents: number;
          practitioner_id: string;
          price_cents: number;
          seeker_id: string;
          slot_id?: string | null;
          starts_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number;
          fee_cents?: number;
          id?: string;
          join_url?: string | null;
          note?: string | null;
          package_id?: string | null;
          package_title?: string;
          payout_cents?: number;
          practitioner_id?: string;
          price_cents?: number;
          seeker_id?: string;
          slot_id?: string | null;
          starts_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketplace_bookings_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "practitioner_packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marketplace_bookings_practitioner_id_fkey";
            columns: ["practitioner_id"];
            isOneToOne: false;
            referencedRelation: "practitioners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marketplace_bookings_slot_id_fkey";
            columns: ["slot_id"];
            isOneToOne: false;
            referencedRelation: "practitioner_slots";
            referencedColumns: ["id"];
          },
        ];
      };
      marketplace_reviews: {
        Row: {
          body: string;
          booking_id: string;
          created_at: string;
          id: string;
          practitioner_id: string;
          rating: number;
          reviewer_id: string;
        };
        Insert: {
          body?: string;
          booking_id: string;
          created_at?: string;
          id?: string;
          practitioner_id: string;
          rating: number;
          reviewer_id: string;
        };
        Update: {
          body?: string;
          booking_id?: string;
          created_at?: string;
          id?: string;
          practitioner_id?: string;
          rating?: number;
          reviewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "marketplace_bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marketplace_reviews_practitioner_id_fkey";
            columns: ["practitioner_id"];
            isOneToOne: false;
            referencedRelation: "practitioners";
            referencedColumns: ["id"];
          },
        ];
      };
      moderation_actions: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          id: string;
          notes: string | null;
          rung: string;
          subject_user_id: string | null;
          target_id: string | null;
          target_kind: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          rung?: string;
          subject_user_id?: string | null;
          target_id?: string | null;
          target_kind: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          rung?: string;
          subject_user_id?: string | null;
          target_id?: string | null;
          target_kind?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          actor_id: string | null;
          community_id: string | null;
          created_at: string;
          episode_id: string | null;
          id: string;
          post_id: string | null;
          question_id: string | null;
          read: boolean;
          type: string;
          user_id: string;
        };
        Insert: {
          actor_id?: string | null;
          community_id?: string | null;
          created_at?: string;
          episode_id?: string | null;
          id?: string;
          post_id?: string | null;
          question_id?: string | null;
          read?: boolean;
          type: string;
          user_id: string;
        };
        Update: {
          actor_id?: string | null;
          community_id?: string | null;
          created_at?: string;
          episode_id?: string | null;
          id?: string;
          post_id?: string | null;
          question_id?: string | null;
          read?: boolean;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "episode_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      observances: {
        Row: {
          created_at: string;
          description: string;
          fasting: boolean;
          id: string;
          name: string;
          observed_on: string;
          tradition: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          fasting?: boolean;
          id?: string;
          name: string;
          observed_on: string;
          tradition: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          fasting?: boolean;
          id?: string;
          name?: string;
          observed_on?: string;
          tradition?: string;
        };
        Relationships: [];
      };
      observation_logs: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          noticed_on: string;
          prompt_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          noticed_on?: string;
          prompt_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          note?: string | null;
          noticed_on?: string;
          prompt_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "observation_logs_prompt_id_fkey";
            columns: ["prompt_id"];
            isOneToOne: false;
            referencedRelation: "observation_prompts";
            referencedColumns: ["id"];
          },
        ];
      };
      observation_prompts: {
        Row: {
          body: string;
          id: string;
          invitation: string;
          sort_order: number;
          tradition: string;
        };
        Insert: {
          body: string;
          id?: string;
          invitation: string;
          sort_order?: number;
          tradition?: string;
        };
        Update: {
          body?: string;
          id?: string;
          invitation?: string;
          sort_order?: number;
          tradition?: string;
        };
        Relationships: [];
      };
      onboarding_steps: {
        Row: {
          completed_on: string;
          created_at: string;
          day_number: number;
          id: string;
          note: string | null;
          user_id: string;
        };
        Insert: {
          completed_on?: string;
          created_at?: string;
          day_number: number;
          id?: string;
          note?: string | null;
          user_id: string;
        };
        Update: {
          completed_on?: string;
          created_at?: string;
          day_number?: number;
          id?: string;
          note?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      passport_shares: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          label: string;
          revoked_at: string | null;
          sections: Json;
          slug: string;
          updated_at: string;
          user_id: string;
          view_count: number;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          label?: string;
          revoked_at?: string | null;
          sections?: Json;
          slug: string;
          updated_at?: string;
          user_id: string;
          view_count?: number;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          label?: string;
          revoked_at?: string | null;
          sections?: Json;
          slug?: string;
          updated_at?: string;
          user_id?: string;
          view_count?: number;
        };
        Relationships: [];
      };
      path_events: {
        Row: {
          created_at: string;
          dedupe_key: string | null;
          id: string;
          kind: string;
          note: string | null;
          ref: string | null;
          tokens: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          dedupe_key?: string | null;
          id?: string;
          kind: string;
          note?: string | null;
          ref?: string | null;
          tokens?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          dedupe_key?: string | null;
          id?: string;
          kind?: string;
          note?: string | null;
          ref?: string | null;
          tokens?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      path_milestones: {
        Row: {
          code: string;
          earned_at: string;
          id: string;
          tokens: number;
          user_id: string;
        };
        Insert: {
          code: string;
          earned_at?: string;
          id?: string;
          tokens?: number;
          user_id: string;
        };
        Update: {
          code?: string;
          earned_at?: string;
          id?: string;
          tokens?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      payment_events: {
        Row: {
          created_at: string;
          error: string | null;
          event_id: string;
          id: string;
          payload: Json;
          processed_at: string | null;
          provider: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          error?: string | null;
          event_id: string;
          id?: string;
          payload: Json;
          processed_at?: string | null;
          provider?: string;
          type: string;
        };
        Update: {
          created_at?: string;
          error?: string | null;
          event_id?: string;
          id?: string;
          payload?: Json;
          processed_at?: string | null;
          provider?: string;
          type?: string;
        };
        Relationships: [];
      };
      payment_orders: {
        Row: {
          amount_cents: number;
          created_at: string;
          creator_cents: number;
          creator_id: string | null;
          currency: string;
          failure_reason: string | null;
          fee_cents: number;
          id: string;
          idempotency_key: string;
          ledger_entry_id: string | null;
          provider: string;
          provider_order_id: string | null;
          provider_payment_id: string | null;
          purpose: string;
          reference_id: string | null;
          reference_kind: string | null;
          refunded_cents: number;
          settled_at: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          creator_cents?: number;
          creator_id?: string | null;
          currency?: string;
          failure_reason?: string | null;
          fee_cents?: number;
          id?: string;
          idempotency_key: string;
          ledger_entry_id?: string | null;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          purpose: string;
          reference_id?: string | null;
          reference_kind?: string | null;
          refunded_cents?: number;
          settled_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          creator_cents?: number;
          creator_id?: string | null;
          currency?: string;
          failure_reason?: string | null;
          fee_cents?: number;
          id?: string;
          idempotency_key?: string;
          ledger_entry_id?: string | null;
          provider?: string;
          provider_order_id?: string | null;
          provider_payment_id?: string | null;
          purpose?: string;
          reference_id?: string | null;
          reference_kind?: string | null;
          refunded_cents?: number;
          settled_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      payout_requests: {
        Row: {
          amount_cents: number;
          created_at: string;
          creator_id: string;
          currency: string;
          id: string;
          idempotency_key: string | null;
          note: string | null;
          paid_at: string | null;
          provider: string | null;
          provider_failure_reason: string | null;
          provider_payout_id: string | null;
          provider_status: string | null;
          reconciled_at: string | null;
          review_note: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          risk_flags: string[];
          status: string;
          updated_at: string;
        };
        Insert: {
          amount_cents: number;
          created_at?: string;
          creator_id: string;
          currency?: string;
          id?: string;
          idempotency_key?: string | null;
          note?: string | null;
          paid_at?: string | null;
          provider?: string | null;
          provider_failure_reason?: string | null;
          provider_payout_id?: string | null;
          provider_status?: string | null;
          reconciled_at?: string | null;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_flags?: string[];
          status?: string;
          updated_at?: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          creator_id?: string;
          currency?: string;
          id?: string;
          idempotency_key?: string | null;
          note?: string | null;
          paid_at?: string | null;
          provider?: string | null;
          provider_failure_reason?: string | null;
          provider_payout_id?: string | null;
          provider_status?: string | null;
          reconciled_at?: string | null;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_flags?: string[];
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      place_layers: {
        Row: {
          body: string;
          created_at: string;
          created_by: string | null;
          id: string;
          image_url: string | null;
          layer: string;
          place_id: string;
          provenance: string;
          sort_order: number;
          source_id: string | null;
          title: string;
          tradition: string | null;
        };
        Insert: {
          body?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          layer: string;
          place_id: string;
          provenance?: string;
          sort_order?: number;
          source_id?: string | null;
          title: string;
          tradition?: string | null;
        };
        Update: {
          body?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          image_url?: string | null;
          layer?: string;
          place_id?: string;
          provenance?: string;
          sort_order?: number;
          source_id?: string | null;
          title?: string;
          tradition?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "place_layers_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_layers_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_layers_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      place_map_points: {
        Row: {
          category: string;
          created_at: string;
          created_by: string | null;
          id: string;
          latitude: number;
          longitude: number;
          name: string;
          note: string | null;
          place_id: string;
          provenance: string;
          source_id: string | null;
          tradition: string | null;
        };
        Insert: {
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          latitude: number;
          longitude: number;
          name: string;
          note?: string | null;
          place_id: string;
          provenance?: string;
          source_id?: string | null;
          tradition?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          latitude?: number;
          longitude?: number;
          name?: string;
          note?: string | null;
          place_id?: string;
          provenance?: string;
          source_id?: string | null;
          tradition?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "place_map_points_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_map_points_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_map_points_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "sources";
            referencedColumns: ["id"];
          },
        ];
      };
      place_relationships: {
        Row: {
          created_at: string;
          from_place: string;
          id: string;
          note: string | null;
          relation: string;
          to_item: string | null;
          to_node: string | null;
          to_place: string | null;
        };
        Insert: {
          created_at?: string;
          from_place: string;
          id?: string;
          note?: string | null;
          relation?: string;
          to_item?: string | null;
          to_node?: string | null;
          to_place?: string | null;
        };
        Update: {
          created_at?: string;
          from_place?: string;
          id?: string;
          note?: string | null;
          relation?: string;
          to_item?: string | null;
          to_node?: string | null;
          to_place?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "place_relationships_from_place_fkey";
            columns: ["from_place"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_relationships_to_item_fkey";
            columns: ["to_item"];
            isOneToOne: false;
            referencedRelation: "cultural_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_relationships_to_node_fkey";
            columns: ["to_node"];
            isOneToOne: false;
            referencedRelation: "wisdom_nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_relationships_to_place_fkey";
            columns: ["to_place"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
        ];
      };
      place_saves: {
        Row: {
          created_at: string;
          id: string;
          place_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          place_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          place_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "place_saves_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "place_saves_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      places: {
        Row: {
          country_code: string;
          created_at: string;
          created_by: string | null;
          hero_url: string | null;
          id: string;
          intro: string | null;
          is_demo: boolean;
          kind: string;
          latitude: number | null;
          longitude: number | null;
          map_zoom: number;
          name: string;
          region_id: string | null;
          slug: string;
          status: string;
          summary: string;
          updated_at: string;
        };
        Insert: {
          country_code: string;
          created_at?: string;
          created_by?: string | null;
          hero_url?: string | null;
          id?: string;
          intro?: string | null;
          is_demo?: boolean;
          kind?: string;
          latitude?: number | null;
          longitude?: number | null;
          map_zoom?: number;
          name: string;
          region_id?: string | null;
          slug: string;
          status?: string;
          summary?: string;
          updated_at?: string;
        };
        Update: {
          country_code?: string;
          created_at?: string;
          created_by?: string | null;
          hero_url?: string | null;
          id?: string;
          intro?: string | null;
          is_demo?: boolean;
          kind?: string;
          latitude?: number | null;
          longitude?: number | null;
          map_zoom?: number;
          name?: string;
          region_id?: string | null;
          slug?: string;
          status?: string;
          summary?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "places_country_code_fkey";
            columns: ["country_code"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "places_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "places_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      platform_config: {
        Row: {
          created_at: string;
          description: string;
          key: string;
          label: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          created_at?: string;
          description?: string;
          key: string;
          label: string;
          updated_at?: string;
          updated_by?: string | null;
          value: Json;
        };
        Update: {
          created_at?: string;
          description?: string;
          key?: string;
          label?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      platform_config_changes: {
        Row: {
          changed_by: string | null;
          created_at: string;
          id: string;
          key: string;
          new_value: Json;
          old_value: Json | null;
        };
        Insert: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          key: string;
          new_value: Json;
          old_value?: Json | null;
        };
        Update: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          key?: string;
          new_value?: Json;
          old_value?: Json | null;
        };
        Relationships: [];
      };
      pool_allocations: {
        Row: {
          amount_cents: number;
          created_at: string;
          creator_id: string;
          distributed_at: string | null;
          distributed_by: string | null;
          id: string;
          period_id: string;
          pool_percentage: number | null;
          score: number;
          share: number;
          source_profit_period: string | null;
          status: string;
        };
        Insert: {
          amount_cents?: number;
          created_at?: string;
          creator_id: string;
          distributed_at?: string | null;
          distributed_by?: string | null;
          id?: string;
          period_id: string;
          pool_percentage?: number | null;
          score?: number;
          share?: number;
          source_profit_period?: string | null;
          status?: string;
        };
        Update: {
          amount_cents?: number;
          created_at?: string;
          creator_id?: string;
          distributed_at?: string | null;
          distributed_by?: string | null;
          id?: string;
          period_id?: string;
          pool_percentage?: number | null;
          score?: number;
          share?: number;
          source_profit_period?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pool_allocations_period_id_fkey";
            columns: ["period_id"];
            isOneToOne: false;
            referencedRelation: "creator_pool_periods";
            referencedColumns: ["id"];
          },
        ];
      };
      post_comments: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          parent_id: string | null;
          post_id: string;
          status: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          post_id: string;
          status?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          post_id?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "post_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_knowledge_links: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          node_id: string;
          note: string | null;
          post_id: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          node_id: string;
          note?: string | null;
          post_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          node_id?: string;
          note?: string | null;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_knowledge_links_node_id_fkey";
            columns: ["node_id"];
            isOneToOne: false;
            referencedRelation: "wisdom_nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_knowledge_links_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_saves: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_saves_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_views: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          session_id: string | null;
          viewer_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          session_id?: string | null;
          viewer_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          session_id?: string | null;
          viewer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          amount_minor: number;
          created_at: string;
          currency: string;
          customer_id: string | null;
          id: string;
          metadata: Json;
          notes: Json;
          order_id: string;
          purpose: string;
          razorpay_order_id: string | null;
          receipt: string;
          status: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount_minor: number;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          id?: string;
          metadata?: Json;
          notes?: Json;
          order_id: string;
          purpose?: string;
          razorpay_order_id?: string | null;
          receipt: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount_minor?: number;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          id?: string;
          metadata?: Json;
          notes?: Json;
          order_id?: string;
          purpose?: string;
          razorpay_order_id?: string | null;
          receipt?: string;
          status?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount_minor: number;
          captured_at: string | null;
          created_at: string;
          currency: string;
          customer_id: string | null;
          error_code: string | null;
          error_description: string | null;
          fee_minor: number;
          id: string;
          metadata: Json;
          method: string;
          order_id: string | null;
          payment_id: string;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_signature: string | null;
          status: string;
          tax_minor: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount_minor: number;
          captured_at?: string | null;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          error_code?: string | null;
          error_description?: string | null;
          fee_minor?: number;
          id?: string;
          metadata?: Json;
          method?: string;
          order_id?: string | null;
          payment_id: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          status?: string;
          tax_minor?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount_minor?: number;
          captured_at?: string | null;
          created_at?: string;
          currency?: string;
          customer_id?: string | null;
          error_code?: string | null;
          error_description?: string | null;
          fee_minor?: number;
          id?: string;
          metadata?: Json;
          method?: string;
          order_id?: string | null;
          payment_id?: string;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_signature?: string | null;
          status?: string;
          tax_minor?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author_id: string;
          comment_count: number;
          community_id: string | null;
          content: string;
          created_at: string;
          id: string;
          like_count: number;
          media_url: string | null;
          source_kind: string | null;
          source_name: string | null;
          source_url: string | null;
          status: string;
          topic: string | null;
          tradition: string | null;
          type: string;
          updated_at: string;
          visibility: string;
        };
        Insert: {
          author_id: string;
          comment_count?: number;
          community_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          like_count?: number;
          media_url?: string | null;
          source_kind?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          status?: string;
          topic?: string | null;
          tradition?: string | null;
          type?: string;
          updated_at?: string;
          visibility?: string;
        };
        Update: {
          author_id?: string;
          comment_count?: number;
          community_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          like_count?: number;
          media_url?: string | null;
          source_kind?: string | null;
          source_name?: string | null;
          source_url?: string | null;
          status?: string;
          topic?: string | null;
          tradition?: string | null;
          type?: string;
          updated_at?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      practice_completions: {
        Row: {
          completed_on: string;
          created_at: string;
          id: string;
          practice_id: string;
          user_id: string;
        };
        Insert: {
          completed_on?: string;
          created_at?: string;
          id?: string;
          practice_id: string;
          user_id: string;
        };
        Update: {
          completed_on?: string;
          created_at?: string;
          id?: string;
          practice_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "practice_completions_practice_id_fkey";
            columns: ["practice_id"];
            isOneToOne: false;
            referencedRelation: "practices";
            referencedColumns: ["id"];
          },
        ];
      };
      practices: {
        Row: {
          category: string;
          created_at: string;
          duration_min: number;
          id: string;
          slug: string;
          steps: string[];
          summary: string;
          title: string;
          tradition: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          duration_min?: number;
          id?: string;
          slug: string;
          steps?: string[];
          summary?: string;
          title: string;
          tradition: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          duration_min?: number;
          id?: string;
          slug?: string;
          steps?: string[];
          summary?: string;
          title?: string;
          tradition?: string;
        };
        Relationships: [];
      };
      practitioner_packages: {
        Row: {
          active: boolean;
          created_at: string;
          description: string;
          duration_minutes: number;
          id: string;
          payout_cents: number;
          practitioner_id: string;
          price_cents: number;
          sessions_count: number;
          sort_order: number;
          title: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string;
          duration_minutes?: number;
          id?: string;
          payout_cents: number;
          practitioner_id: string;
          price_cents: number;
          sessions_count?: number;
          sort_order?: number;
          title: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string;
          duration_minutes?: number;
          id?: string;
          payout_cents?: number;
          practitioner_id?: string;
          price_cents?: number;
          sessions_count?: number;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "practitioner_packages_practitioner_id_fkey";
            columns: ["practitioner_id"];
            isOneToOne: false;
            referencedRelation: "practitioners";
            referencedColumns: ["id"];
          },
        ];
      };
      practitioner_slots: {
        Row: {
          booked: boolean;
          created_at: string;
          id: string;
          practitioner_id: string;
          starts_at: string;
        };
        Insert: {
          booked?: boolean;
          created_at?: string;
          id?: string;
          practitioner_id: string;
          starts_at: string;
        };
        Update: {
          booked?: boolean;
          created_at?: string;
          id?: string;
          practitioner_id?: string;
          starts_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "practitioner_slots_practitioner_id_fkey";
            columns: ["practitioner_id"];
            isOneToOne: false;
            referencedRelation: "practitioners";
            referencedColumns: ["id"];
          },
        ];
      };
      practitioners: {
        Row: {
          about: string;
          avatar_url: string | null;
          categories: string[];
          created_at: string;
          credentials_verified: boolean;
          display_name: string;
          eka_recommended: boolean;
          experience_verified: boolean;
          expertise: string[];
          headline: string;
          id: string;
          identity_verified: boolean;
          languages: string[];
          location: string | null;
          mode: string;
          rating: number;
          review_count: number;
          reviewed_at: string | null;
          reviewed_by: string | null;
          session_count: number;
          slug: string;
          standards_accepted: boolean;
          status: string;
          top_rated: boolean;
          traditions: string[];
          updated_at: string;
          user_id: string | null;
          verification_note: string | null;
          verification_status: string;
          years_experience: number;
        };
        Insert: {
          about?: string;
          avatar_url?: string | null;
          categories?: string[];
          created_at?: string;
          credentials_verified?: boolean;
          display_name: string;
          eka_recommended?: boolean;
          experience_verified?: boolean;
          expertise?: string[];
          headline?: string;
          id?: string;
          identity_verified?: boolean;
          languages?: string[];
          location?: string | null;
          mode?: string;
          rating?: number;
          review_count?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          session_count?: number;
          slug: string;
          standards_accepted?: boolean;
          status?: string;
          top_rated?: boolean;
          traditions?: string[];
          updated_at?: string;
          user_id?: string | null;
          verification_note?: string | null;
          verification_status?: string;
          years_experience?: number;
        };
        Update: {
          about?: string;
          avatar_url?: string | null;
          categories?: string[];
          created_at?: string;
          credentials_verified?: boolean;
          display_name?: string;
          eka_recommended?: boolean;
          experience_verified?: boolean;
          expertise?: string[];
          headline?: string;
          id?: string;
          identity_verified?: boolean;
          languages?: string[];
          location?: string | null;
          mode?: string;
          rating?: number;
          review_count?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          session_count?: number;
          slug?: string;
          standards_accepted?: boolean;
          status?: string;
          top_rated?: boolean;
          traditions?: string[];
          updated_at?: string;
          user_id?: string | null;
          verification_note?: string | null;
          verification_status?: string;
          years_experience?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          account_type: string;
          age_bracket: string | null;
          avatar_url: string | null;
          bio: string | null;
          community_background: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          intentions: string[];
          interests: string[];
          language: string | null;
          onboarded: boolean;
          practices: string[];
          purposes: string[];
          reflection_tone: string;
          region: string | null;
          religion: string | null;
          standards_accepted_at: string | null;
          standards_version: string | null;
          suspended: boolean;
          updated_at: string;
          username: string | null;
          verified: boolean;
        };
        Insert: {
          account_type?: string;
          age_bracket?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          community_background?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          intentions?: string[];
          interests?: string[];
          language?: string | null;
          onboarded?: boolean;
          practices?: string[];
          purposes?: string[];
          reflection_tone?: string;
          region?: string | null;
          religion?: string | null;
          standards_accepted_at?: string | null;
          standards_version?: string | null;
          suspended?: boolean;
          updated_at?: string;
          username?: string | null;
          verified?: boolean;
        };
        Update: {
          account_type?: string;
          age_bracket?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          community_background?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          intentions?: string[];
          interests?: string[];
          language?: string | null;
          onboarded?: boolean;
          practices?: string[];
          purposes?: string[];
          reflection_tone?: string;
          region?: string | null;
          religion?: string | null;
          standards_accepted_at?: string | null;
          standards_version?: string | null;
          suspended?: boolean;
          updated_at?: string;
          username?: string | null;
          verified?: boolean;
        };
        Relationships: [];
      };
      readings: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          source: string;
          title: string;
          tradition: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          source?: string;
          title: string;
          tradition: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          source?: string;
          title?: string;
          tradition?: string;
        };
        Relationships: [];
      };
      reconciliation_exceptions: {
        Row: {
          actual_cents: number | null;
          created_at: string;
          detail: string | null;
          expected_cents: number | null;
          id: string;
          kind: string;
          ledger_entry_id: string | null;
          payment_order_id: string | null;
          provider: string;
          provider_reference: string | null;
          resolution_note: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          actual_cents?: number | null;
          created_at?: string;
          detail?: string | null;
          expected_cents?: number | null;
          id?: string;
          kind: string;
          ledger_entry_id?: string | null;
          payment_order_id?: string | null;
          provider?: string;
          provider_reference?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          actual_cents?: number | null;
          created_at?: string;
          detail?: string | null;
          expected_cents?: number | null;
          id?: string;
          kind?: string;
          ledger_entry_id?: string | null;
          payment_order_id?: string | null;
          provider?: string;
          provider_reference?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reconciliation_exceptions_payment_order_id_fkey";
            columns: ["payment_order_id"];
            isOneToOne: false;
            referencedRelation: "payment_orders";
            referencedColumns: ["id"];
          },
        ];
      };
      reel_views: {
        Row: {
          completed: boolean;
          created_at: string;
          id: string;
          reel_id: string;
          user_id: string;
          watched_seconds: number;
        };
        Insert: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          reel_id: string;
          user_id: string;
          watched_seconds?: number;
        };
        Update: {
          completed?: boolean;
          created_at?: string;
          id?: string;
          reel_id?: string;
          user_id?: string;
          watched_seconds?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reel_views_reel_id_fkey";
            columns: ["reel_id"];
            isOneToOne: false;
            referencedRelation: "reels";
            referencedColumns: ["id"];
          },
        ];
      };
      reels: {
        Row: {
          context_note: string;
          created_at: string;
          creator_id: string;
          duration_seconds: number;
          id: string;
          media_kind: string;
          media_url: string;
          sensitive: boolean;
          status: string;
          thumbnail_url: string | null;
          title: string;
          topic_slug: string | null;
          tradition: string;
        };
        Insert: {
          context_note: string;
          created_at?: string;
          creator_id: string;
          duration_seconds?: number;
          id?: string;
          media_kind?: string;
          media_url: string;
          sensitive?: boolean;
          status?: string;
          thumbnail_url?: string | null;
          title: string;
          topic_slug?: string | null;
          tradition?: string;
        };
        Update: {
          context_note?: string;
          created_at?: string;
          creator_id?: string;
          duration_seconds?: number;
          id?: string;
          media_kind?: string;
          media_url?: string;
          sensitive?: boolean;
          status?: string;
          thumbnail_url?: string | null;
          title?: string;
          topic_slug?: string | null;
          tradition?: string;
        };
        Relationships: [];
      };
      regions: {
        Row: {
          country_code: string;
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          country_code: string;
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          country_code?: string;
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "regions_country_code_fkey";
            columns: ["country_code"];
            isOneToOne: false;
            referencedRelation: "countries";
            referencedColumns: ["code"];
          },
        ];
      };
      retention_offers: {
        Row: {
          accepted_at: string | null;
          created_at: string;
          discount_percent: number;
          expires_at: string;
          id: string;
          kind: string;
          pause_days: number;
          status: string;
          user_id: string;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string;
          discount_percent?: number;
          expires_at?: string;
          id?: string;
          kind: string;
          pause_days?: number;
          status?: string;
          user_id: string;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string;
          discount_percent?: number;
          expires_at?: string;
          id?: string;
          kind?: string;
          pause_days?: number;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      rhythm_adjustments: {
        Row: {
          created_at: string;
          from_days: number[] | null;
          from_time: string | null;
          id: string;
          kind: string;
          reason: string;
          reminder_id: string;
          reverted_at: string | null;
          to_days: number[] | null;
          to_time: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          from_days?: number[] | null;
          from_time?: string | null;
          id?: string;
          kind: string;
          reason: string;
          reminder_id: string;
          reverted_at?: string | null;
          to_days?: number[] | null;
          to_time?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          from_days?: number[] | null;
          from_time?: string | null;
          id?: string;
          kind?: string;
          reason?: string;
          reminder_id?: string;
          reverted_at?: string | null;
          to_days?: number[] | null;
          to_time?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rhythm_adjustments_reminder_id_fkey";
            columns: ["reminder_id"];
            isOneToOne: false;
            referencedRelation: "rhythm_reminders";
            referencedColumns: ["id"];
          },
        ];
      };
      rhythm_checkins: {
        Row: {
          created_at: string;
          done_on: string;
          id: string;
          intention_note: string;
          mood: string | null;
          reflection: string;
          reminder_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          done_on?: string;
          id?: string;
          intention_note?: string;
          mood?: string | null;
          reflection?: string;
          reminder_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          done_on?: string;
          id?: string;
          intention_note?: string;
          mood?: string | null;
          reflection?: string;
          reminder_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rhythm_checkins_reminder_id_fkey";
            columns: ["reminder_id"];
            isOneToOne: false;
            referencedRelation: "rhythm_reminders";
            referencedColumns: ["id"];
          },
        ];
      };
      rhythm_completions: {
        Row: {
          completed_at: string;
          created_at: string;
          done_on: string;
          id: string;
          minute_of_day: number;
          reminder_id: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          created_at?: string;
          done_on?: string;
          id?: string;
          minute_of_day?: number;
          reminder_id?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          created_at?: string;
          done_on?: string;
          id?: string;
          minute_of_day?: number;
          reminder_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rhythm_completions_reminder_id_fkey";
            columns: ["reminder_id"];
            isOneToOne: false;
            referencedRelation: "rhythm_reminders";
            referencedColumns: ["id"];
          },
        ];
      };
      rhythm_reminders: {
        Row: {
          active: boolean;
          created_at: string;
          days_of_week: number[];
          glyph: string;
          guidance: string;
          id: string;
          intention: string | null;
          intention_shown_at: string | null;
          label: string;
          notify: boolean;
          pillar: string;
          shift_suggestion_dismissed_at: string | null;
          sort_order: number;
          time_of_day: string;
          updated_at: string;
          user_id: string;
          window_suggestion_dismissed_at: string | null;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          days_of_week?: number[];
          glyph?: string;
          guidance?: string;
          id?: string;
          intention?: string | null;
          intention_shown_at?: string | null;
          label: string;
          notify?: boolean;
          pillar?: string;
          shift_suggestion_dismissed_at?: string | null;
          sort_order?: number;
          time_of_day: string;
          updated_at?: string;
          user_id: string;
          window_suggestion_dismissed_at?: string | null;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          days_of_week?: number[];
          glyph?: string;
          guidance?: string;
          id?: string;
          intention?: string | null;
          intention_shown_at?: string | null;
          label?: string;
          notify?: boolean;
          pillar?: string;
          shift_suggestion_dismissed_at?: string | null;
          sort_order?: number;
          time_of_day?: string;
          updated_at?: string;
          user_id?: string;
          window_suggestion_dismissed_at?: string | null;
        };
        Relationships: [];
      };
      rhythm_settings: {
        Row: {
          auto_adjust: boolean;
          channel_browser: boolean;
          channel_email: boolean;
          channel_in_app: boolean;
          checkins_enabled: boolean;
          created_at: string;
          dnd_enabled: boolean;
          dnd_end: string;
          dnd_start: string;
          moments_per_day: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auto_adjust?: boolean;
          channel_browser?: boolean;
          channel_email?: boolean;
          channel_in_app?: boolean;
          checkins_enabled?: boolean;
          created_at?: string;
          dnd_enabled?: boolean;
          dnd_end?: string;
          dnd_start?: string;
          moments_per_day?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auto_adjust?: boolean;
          channel_browser?: boolean;
          channel_email?: boolean;
          channel_in_app?: boolean;
          checkins_enabled?: boolean;
          created_at?: string;
          dnd_enabled?: boolean;
          dnd_end?: string;
          dnd_start?: string;
          moments_per_day?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      sources: {
        Row: {
          author: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          kind: string;
          language: string | null;
          name: string;
          notes: string | null;
          published_on: string | null;
          publisher: string | null;
          region: string | null;
          reliability: string;
          tradition: string | null;
          url: string | null;
        };
        Insert: {
          author?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          kind?: string;
          language?: string | null;
          name: string;
          notes?: string | null;
          published_on?: string | null;
          publisher?: string | null;
          region?: string | null;
          reliability?: string;
          tradition?: string | null;
          url?: string | null;
        };
        Update: {
          author?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          kind?: string;
          language?: string | null;
          name?: string;
          notes?: string | null;
          published_on?: string | null;
          publisher?: string | null;
          region?: string | null;
          reliability?: string;
          tradition?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sources_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          amount_minor: number | null;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          cancelled_at: string | null;
          created_at: string;
          currency: string;
          current_period_end: string | null;
          customer_id: string | null;
          expires_at: string | null;
          failure_count: number | null;
          id: string;
          latest_invoice_id: string | null;
          paused_at: string | null;
          paused_until: string | null;
          plan: string;
          price_cents: number;
          provider: string | null;
          provider_customer_id: string | null;
          provider_price_id: string | null;
          provider_reference: string | null;
          provider_subscription_id: string | null;
          razorpay_customer_id: string | null;
          razorpay_payment_id: string | null;
          razorpay_plan_id: string | null;
          razorpay_subscription_id: string | null;
          renewal_date: string | null;
          resumed_at: string | null;
          retention_offer_applied: boolean;
          short_url: string | null;
          start_date: string | null;
          started_at: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount_minor?: number | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          currency?: string;
          current_period_end?: string | null;
          customer_id?: string | null;
          expires_at?: string | null;
          failure_count?: number | null;
          id?: string;
          latest_invoice_id?: string | null;
          paused_at?: string | null;
          paused_until?: string | null;
          plan?: string;
          price_cents?: number;
          provider?: string | null;
          provider_customer_id?: string | null;
          provider_price_id?: string | null;
          provider_reference?: string | null;
          provider_subscription_id?: string | null;
          razorpay_customer_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_plan_id?: string | null;
          razorpay_subscription_id?: string | null;
          renewal_date?: string | null;
          resumed_at?: string | null;
          retention_offer_applied?: boolean;
          short_url?: string | null;
          start_date?: string | null;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount_minor?: number | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          currency?: string;
          current_period_end?: string | null;
          customer_id?: string | null;
          expires_at?: string | null;
          failure_count?: number | null;
          id?: string;
          latest_invoice_id?: string | null;
          paused_at?: string | null;
          paused_until?: string | null;
          plan?: string;
          price_cents?: number;
          provider?: string | null;
          provider_customer_id?: string | null;
          provider_price_id?: string | null;
          provider_reference?: string | null;
          provider_subscription_id?: string | null;
          razorpay_customer_id?: string | null;
          razorpay_payment_id?: string | null;
          razorpay_plan_id?: string | null;
          razorpay_subscription_id?: string | null;
          renewal_date?: string | null;
          resumed_at?: string | null;
          retention_offer_applied?: boolean;
          short_url?: string | null;
          start_date?: string | null;
          started_at?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      theme_links: {
        Row: {
          created_at: string;
          id: string;
          lane: string;
          note: string | null;
          sort_order: number;
          target_kind: string;
          target_ref: string;
          theme_slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lane: string;
          note?: string | null;
          sort_order?: number;
          target_kind: string;
          target_ref: string;
          theme_slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lane?: string;
          note?: string | null;
          sort_order?: number;
          target_kind?: string;
          target_ref?: string;
          theme_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "theme_links_theme_slug_fkey";
            columns: ["theme_slug"];
            isOneToOne: false;
            referencedRelation: "themes";
            referencedColumns: ["slug"];
          },
        ];
      };
      themes: {
        Row: {
          active: boolean;
          blurb: string;
          created_at: string;
          keywords: string[];
          label: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          blurb?: string;
          created_at?: string;
          keywords?: string[];
          label: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          blurb?: string;
          created_at?: string;
          keywords?: string[];
          label?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      trust_incident_events: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          id: string;
          incident_id: string;
          note: string | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          id?: string;
          incident_id: string;
          note?: string | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          id?: string;
          incident_id?: string;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trust_incident_events_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "trust_incidents";
            referencedColumns: ["id"];
          },
        ];
      };
      trust_incident_evidence: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string;
          id: string;
          incident_id: string;
          kind: string;
          storage_path: string | null;
          url: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          incident_id: string;
          kind?: string;
          storage_path?: string | null;
          url?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          incident_id?: string;
          kind?: string;
          storage_path?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "trust_incident_evidence_incident_id_fkey";
            columns: ["incident_id"];
            isOneToOne: false;
            referencedRelation: "trust_incidents";
            referencedColumns: ["id"];
          },
        ];
      };
      trust_incidents: {
        Row: {
          booking_id: string | null;
          category: string;
          created_at: string;
          id: string;
          outcome: string | null;
          practitioner_id: string | null;
          reporter_id: string;
          resolution: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          severity: string;
          status: string;
          subject_user_id: string | null;
          summary: string;
          updated_at: string;
        };
        Insert: {
          booking_id?: string | null;
          category: string;
          created_at?: string;
          id?: string;
          outcome?: string | null;
          practitioner_id?: string | null;
          reporter_id: string;
          resolution?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: string;
          status?: string;
          subject_user_id?: string | null;
          summary: string;
          updated_at?: string;
        };
        Update: {
          booking_id?: string | null;
          category?: string;
          created_at?: string;
          id?: string;
          outcome?: string | null;
          practitioner_id?: string | null;
          reporter_id?: string;
          resolution?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: string;
          status?: string;
          subject_user_id?: string | null;
          summary?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trust_incidents_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "marketplace_bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trust_incidents_practitioner_id_fkey";
            columns: ["practitioner_id"];
            isOneToOne: false;
            referencedRelation: "practitioners";
            referencedColumns: ["id"];
          },
        ];
      };
      user_blocks: {
        Row: {
          blocked_id: string;
          blocker_id: string;
          created_at: string;
          id: string;
        };
        Insert: {
          blocked_id: string;
          blocker_id: string;
          created_at?: string;
          id?: string;
        };
        Update: {
          blocked_id?: string;
          blocker_id?: string;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      user_path: {
        Row: {
          stage: string;
          tradition: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          stage?: string;
          tradition?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          stage?: string;
          tradition?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_restrictions: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          issued_by: string | null;
          level: string;
          lifted_at: string | null;
          reason: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          issued_by?: string | null;
          level?: string;
          lifted_at?: string | null;
          reason: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          issued_by?: string | null;
          level?: string;
          lifted_at?: string | null;
          reason?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      wallet_transactions: {
        Row: {
          amount_cents: number;
          counterparty_id: string | null;
          created_at: string;
          currency: string;
          fee_cents: number;
          id: string;
          kind: string;
          note: string | null;
          reference_id: string | null;
          reference_kind: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          amount_cents: number;
          counterparty_id?: string | null;
          created_at?: string;
          currency?: string;
          fee_cents?: number;
          id?: string;
          kind: string;
          note?: string | null;
          reference_id?: string | null;
          reference_kind?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          amount_cents?: number;
          counterparty_id?: string | null;
          created_at?: string;
          currency?: string;
          fee_cents?: number;
          id?: string;
          kind?: string;
          note?: string | null;
          reference_id?: string | null;
          reference_kind?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wallets: {
        Row: {
          balance_cents: number;
          currency: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance_cents?: number;
          currency?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance_cents?: number;
          currency?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      wisdom_edges: {
        Row: {
          created_at: string;
          from_node: string;
          id: string;
          note: string | null;
          relation: string;
          source_name: string | null;
          source_url: string | null;
          to_node: string;
        };
        Insert: {
          created_at?: string;
          from_node: string;
          id?: string;
          note?: string | null;
          relation: string;
          source_name?: string | null;
          source_url?: string | null;
          to_node: string;
        };
        Update: {
          created_at?: string;
          from_node?: string;
          id?: string;
          note?: string | null;
          relation?: string;
          source_name?: string | null;
          source_url?: string | null;
          to_node?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wisdom_edges_from_node_fkey";
            columns: ["from_node"];
            isOneToOne: false;
            referencedRelation: "wisdom_nodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wisdom_edges_to_node_fkey";
            columns: ["to_node"];
            isOneToOne: false;
            referencedRelation: "wisdom_nodes";
            referencedColumns: ["id"];
          },
        ];
      };
      wisdom_nodes: {
        Row: {
          created_at: string;
          id: string;
          kind: string;
          license: string | null;
          slug: string;
          sort_order: number;
          source_name: string | null;
          source_url: string | null;
          summary: string | null;
          title: string;
          tradition: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind: string;
          license?: string | null;
          slug: string;
          sort_order?: number;
          source_name?: string | null;
          source_url?: string | null;
          summary?: string | null;
          title: string;
          tradition?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: string;
          license?: string | null;
          slug?: string;
          sort_order?: number;
          source_name?: string | null;
          source_url?: string | null;
          summary?: string | null;
          title?: string;
          tradition?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      wisdom_passport_settings: {
        Row: {
          created_at: string;
          sections: Json;
          share_enabled: boolean;
          share_slug: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          sections?: Json;
          share_enabled?: boolean;
          share_slug?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          sections?: Json;
          share_enabled?: boolean;
          share_slug?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      appreciation_standings: {
        Args: never;
        Returns: {
          creator_id: string;
          cross_tradition: number;
          display_name: string;
          people: number;
          points: number;
          username: string;
        }[];
      };
      appreciation_weight: { Args: { _reaction: string }; Returns: number };
      available_payout_cents: { Args: { _uid: string }; Returns: number };
      award_path_tokens: {
        Args: {
          _base?: number;
          _dedupe?: string;
          _kind: string;
          _note?: string;
          _ref?: string;
        };
        Returns: number;
      };
      claim_reflection_milestone: { Args: { _code: string }; Returns: number };
      close_finance_period: {
        Args: { _cash_balance_cents?: number; _period: string };
        Returns: undefined;
      };
      creator_appreciation: { Args: { _user_id: string }; Returns: Json };
      creator_score_breakdown: { Args: { _uid: string }; Returns: Json };
      creator_value_simulation: {
        Args: { _pool_cents: number };
        Returns: {
          amount_cents: number;
          creator_id: string;
          display_name: string;
          points: number;
          share: number;
          username: string;
        }[];
      };
      eka_economics: { Args: { _from: string; _to: string }; Returns: Json };
      eka_economics_months: {
        Args: { _months?: number };
        Returns: {
          data: Json;
          period: string;
        }[];
      };
      fail_payment_order: {
        Args: { _provider_order_id: string; _reason: string };
        Returns: undefined;
      };
      finance_period_summary: {
        Args: { _from: string; _to: string };
        Returns: {
          actual_expenses_cents: number;
          cash_balance_cents: number;
          closed: boolean;
          community_budget_cents: number;
          creator_pool_cents: number;
          creators_paid: number;
          founder_comp_cents: number;
          gmv_cents: number;
          gross_revenue_cents: number;
          mission_spend_cents: number;
          net_revenue_cents: number;
          operations_budget_cents: number;
          owner_distributions_cents: number;
          peace_budget_cents: number;
          period: string;
          processing_cents: number;
          refunds_cents: number;
          retained_budget_cents: number;
          transactions: number;
          trust_budget_cents: number;
        }[];
      };
      has_completion_evidence: {
        Args: { _kind: string; _uid: string };
        Returns: boolean;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      has_step_up: { Args: never; Returns: boolean };
      is_community_moderator: {
        Args: { _community_id: string; _user_id: string };
        Returns: boolean;
      };
      journey_completion_stats: {
        Args: never;
        Returns: {
          completed: number;
          duration_days: number;
          enrolled: number;
          journey: string;
        }[];
      };
      meaningful_spiritual_days: {
        Args: { _days?: number };
        Returns: {
          actions: number;
          day: string;
          members: number;
        }[];
      };
      my_wisdom_passport: { Args: never; Returns: Json };
      passport_by_token: { Args: { _slug: string }; Returns: Json };
      path_token_value: { Args: { _kind: string }; Returns: number };
      pool_funding_summary: {
        Args: { _from: string; _to: string };
        Returns: {
          fee_cents: number;
          gross_cents: number;
          transactions: number;
        }[];
      };
      record_ledger_entry: {
        Args: {
          _creator_id: string;
          _currency?: string;
          _eka_gross_fee: number;
          _gross_creator_amount: number;
          _member_id: string;
          _note?: string;
          _transaction_ref?: string;
        };
        Returns: string;
      };
      refund_payment_order: {
        Args: {
          _amount_cents: number;
          _note?: string;
          _provider_payment_id: string;
        };
        Returns: string;
      };
      request_payout: {
        Args: { _amount_cents: number; _note?: string };
        Returns: string;
      };
      retention_cohorts: {
        Args: { _weeks?: number };
        Returns: {
          cohort: string;
          d30: number;
          d7: number;
          signups: number;
        }[];
      };
      reverse_ledger_entry: {
        Args: { _id: string; _note?: string };
        Returns: string;
      };
      review_payout: {
        Args: { _id: string; _note?: string; _status: string };
        Returns: undefined;
      };
      review_practitioner: {
        Args: {
          _credentials: boolean;
          _experience: boolean;
          _id: string;
          _identity: boolean;
          _note?: string;
          _status: string;
        };
        Returns: undefined;
      };
      review_trust_incident: {
        Args: {
          _id: string;
          _note?: string;
          _outcome?: string;
          _status: string;
        };
        Returns: undefined;
      };
      settle_payment_order: {
        Args: { _provider_order_id: string; _provider_payment_id: string };
        Returns: string;
      };
      shared_wisdom_passport: { Args: { _slug: string }; Returns: Json };
      trust_profile: { Args: { _practitioner: string }; Returns: Json };
      wisdom_passport_for: { Args: { _uid: string }; Returns: Json };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const;
