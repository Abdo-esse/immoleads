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
      agencies: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          city: string | null
          logo_url: string | null
          whatsapp_number: string | null
          wa_phone_id: string | null
          wa_access_token: string | null
          wa_business_id: string | null
          commission_rate: number | null
          agent_share: number | null
          monthly_lead_goal: number | null
          monthly_won_goal: number | null
          monthly_revenue_goal: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          email?: string | null
          city?: string | null
          logo_url?: string | null
          whatsapp_number?: string | null
          wa_phone_id?: string | null
          wa_access_token?: string | null
          wa_business_id?: string | null
          commission_rate?: number | null
          agent_share?: number | null
          monthly_lead_goal?: number | null
          monthly_won_goal?: number | null
          monthly_revenue_goal?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          email?: string | null
          city?: string | null
          logo_url?: string | null
          whatsapp_number?: string | null
          wa_phone_id?: string | null
          wa_access_token?: string | null
          wa_business_id?: string | null
          commission_rate?: number | null
          agent_share?: number | null
          monthly_lead_goal?: number | null
          monthly_won_goal?: number | null
          monthly_revenue_goal?: number | null
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          agency_id: string | null
          full_name: string
          email: string
          phone: string | null
          role: 'superadmin' | 'admin' | 'agent'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          agency_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          role?: 'superadmin' | 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'superadmin' | 'admin' | 'agent'
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          agency_id: string
          assigned_agent_id: string | null
          title: string
          slug: string
          description: string | null
          price: number
          city: string
          district: string | null
          type: 'apartment' | 'villa' | 'studio' | 'riad' | 'terrain' | 'commercial'
          transaction_type: 'sale' | 'rent'
          bedrooms: number | null
          bathrooms: number | null
          area: number | null
          status: 'active' | 'draft' | 'sold' | 'rented'
          images: string[]
          features: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          assigned_agent_id?: string | null
          title: string
          slug: string
          description?: string | null
          price: number
          city: string
          district?: string | null
          type: 'apartment' | 'villa' | 'studio' | 'riad' | 'terrain' | 'commercial'
          transaction_type: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          status?: 'active' | 'draft' | 'sold' | 'rented'
          images?: string[]
          features?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          assigned_agent_id?: string | null
          title?: string
          slug?: string
          description?: string | null
          price?: number
          city?: string
          district?: string | null
          type?: 'apartment' | 'villa' | 'studio' | 'riad' | 'terrain' | 'commercial'
          transaction_type?: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number | null
          status?: 'active' | 'draft' | 'sold' | 'rented'
          images?: string[]
          features?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          agency_id: string
          property_id: string | null
          assigned_to: string | null
          name: string
          phone: string
          email: string | null
          budget_min: number | null
          budget_max: number | null
          city: string | null
          property_type: string | null
          transaction_type: string | null
          timeline: 'immediate' | '1-3months' | '3-6months' | '6months+' | null
          source: 'website' | 'facebook' | 'instagram' | 'google' | 'referral' | 'other' | null
          utm_source: string | null
          utm_campaign: string | null
          utm_content: string | null
          referrer: string | null
          status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VISIT_SCHEDULED' | 'NEGOTIATION' | 'WON' | 'LOST'
          lost_reason: 'budget_mismatch' | 'not_interested' | 'no_response' | 'bought_elsewhere' | 'postponed' | 'other' | null
          last_contacted_at: string | null
          next_follow_up_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          property_id?: string | null
          assigned_to?: string | null
          name: string
          phone: string
          email?: string | null
          budget_min?: number | null
          budget_max?: number | null
          city?: string | null
          property_type?: string | null
          transaction_type?: string | null
          timeline?: 'immediate' | '1-3months' | '3-6months' | '6months+' | null
          source?: 'website' | 'facebook' | 'instagram' | 'google' | 'referral' | 'other' | null
          utm_source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          referrer?: string | null
          status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VISIT_SCHEDULED' | 'NEGOTIATION' | 'WON' | 'LOST'
          lost_reason?: 'budget_mismatch' | 'not_interested' | 'no_response' | 'bought_elsewhere' | 'postponed' | 'other' | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          property_id?: string | null
          assigned_to?: string | null
          name?: string
          phone?: string
          email?: string | null
          budget_min?: number | null
          budget_max?: number | null
          city?: string | null
          property_type?: string | null
          transaction_type?: string | null
          timeline?: 'immediate' | '1-3months' | '3-6months' | '6months+' | null
          source?: 'website' | 'facebook' | 'instagram' | 'google' | 'referral' | 'other' | null
          utm_source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          referrer?: string | null
          status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VISIT_SCHEDULED' | 'NEGOTIATION' | 'WON' | 'LOST'
          lost_reason?: 'budget_mismatch' | 'not_interested' | 'no_response' | 'bought_elsewhere' | 'postponed' | 'other' | null
          last_contacted_at?: string | null
          next_follow_up_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          id: string
          lead_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          id: string
          lead_id: string
          property_id: string
          agent_id: string
          agency_id: string
          visit_date: string
          visit_time: string
          status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          property_id: string
          agent_id: string
          agency_id: string
          visit_date: string
          visit_time: string
          status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          property_id?: string
          agent_id?: string
          agency_id?: string
          visit_date?: string
          visit_time?: string
          status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          user_id: string | null
          action: string
          details: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id?: string | null
          action: string
          details?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string | null
          action?: string
          details?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          id: string
          agency_id: string
          lead_id: string
          sender_id: string | null
          phone: string
          message: string
          template: string | null
          status: string
          wa_message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          lead_id: string
          sender_id?: string | null
          phone: string
          message: string
          template?: string | null
          status?: string
          wa_message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          lead_id?: string
          sender_id?: string | null
          phone?: string
          message?: string
          template?: string | null
          status?: string
          wa_message_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      demo_requests: {
        Row: {
          id: string
          full_name: string
          phone: string
          agency_name: string | null
          city: string
          team_size: string | null
          lead_sources: string[] | null
          monthly_leads: string | null
          main_problem: string | null
          status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'
          notes: string | null
          agency_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          agency_name?: string | null
          city: string
          team_size?: string | null
          lead_sources?: string[] | null
          monthly_leads?: string | null
          main_problem?: string | null
          status?: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'
          notes?: string | null
          agency_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          agency_name?: string | null
          city?: string
          team_size?: string | null
          lead_sources?: string[] | null
          monthly_leads?: string | null
          main_problem?: string | null
          status?: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED'
          notes?: string | null
          agency_id?: string | null
          created_at?: string
          updated_at?: string
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
