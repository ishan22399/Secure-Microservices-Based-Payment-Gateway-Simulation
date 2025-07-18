
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string | null;
          company_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          customer_id: string | null;
          merchant_id: string | null;
          amount: number;
          currency: string;
          status: string | null;
          payment_method_id: string | null;
          description: string | null;
          timestamp: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          customer_id?: string | null;
          merchant_id?: string | null;
          amount: number;
          currency: string;
          status?: string | null;
          payment_method_id?: string | null;
          description?: string | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          customer_id?: string | null;
          merchant_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string | null;
          payment_method_id?: string | null;
          description?: string | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          details: Json | null;
          last4: string | null;
          brand: string | null;
          is_active: boolean | null;
          is_default: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          type: string;
          details?: Json | null;
          last4?: string | null;
          brand?: string | null;
          is_active?: boolean | null;
          is_default?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          type?: string;
          details?: Json | null;
          last4?: string | null;
          brand?: string | null;
          is_active?: boolean | null;
          is_default?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      payment_links: {
        Row: {
          id: string;
          merchant_id: string;
          amount: number;
          currency: string;
          description: string | null;
          expires_at: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          merchant_id: string;
          amount: number;
          currency: string;
          description?: string | null;
          expires_at?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          currency?: string;
          description?: string | null;
          expires_at?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string | null;
          message: string;
          data: Json | null;
          read: boolean | null;
          timestamp: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          type: string;
          title?: string | null;
          message: string;
          data?: Json | null;
          read?: boolean | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          type?: string;
          title?: string | null;
          message?: string;
          data?: Json | null;
          read?: boolean | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      merchants: {
        Row: {
          id: string;
          name: string;
          email: string;
          status: string | null;
          risk_level: string | null;
          business_type: string | null;
          address: string | null;
          phone: string | null;
          contact_name: string | null;
          monthly_volume: number | null;
          join_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          name: string;
          email: string;
          status?: string | null;
          risk_level?: string | null;
          business_type?: string | null;
          address?: string | null;
          phone?: string | null;
          contact_name?: string | null;
          monthly_volume?: number | null;
          join_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          status?: string | null;
          risk_level?: string | null;
          business_type?: string | null;
          address?: string | null;
          phone?: string | null;
          contact_name?: string | null;
          monthly_volume?: number | null;
          join_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          merchant_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          merchant_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          severity: string | null;
          details: Json | null;
          ip_address: string | null;
          timestamp: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          severity?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_id?: string | null;
          action?: string;
          severity?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event_name: string;
          event_data: Json | null;
          timestamp: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          event_name: string;
          event_data?: Json | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          event_name?: string;
          event_data?: Json | null;
          timestamp?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      merchant_onboarding: {
        Row: {
          id: string;
          business_name: string;
          contact_email: string;
          status: string | null;
          application_data: Json | null;
          submitted_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          business_name: string;
          contact_email: string;
          status?: string | null;
          application_data?: Json | null;
          submitted_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          business_name?: string;
          contact_email?: string;
          status?: string | null;
          application_data?: Json | null;
          submitted_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
