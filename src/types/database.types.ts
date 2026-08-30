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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          default_currency: Database["public"]["Enums"]["currency_code"]
          landlord_contact: Json
          logo_path: string | null
          notification_templates: Json
          organization_id: string
          platform_name: string
          receipt_settings: Json
          reminder_rules: Json
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          landlord_contact?: Json
          logo_path?: string | null
          notification_templates?: Json
          organization_id: string
          platform_name?: string
          receipt_settings?: Json
          reminder_rules?: Json
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["currency_code"]
          landlord_contact?: Json
          logo_path?: string | null
          notification_templates?: Json
          organization_id?: string
          platform_name?: string
          receipt_settings?: Json
          reminder_rules?: Json
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          reason: string | null
          request_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          reason?: string | null
          request_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          reason?: string | null
          request_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          archived_at: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          property_id: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          property_id: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildings_org_property_fkey"
            columns: ["organization_id", "property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      deposit_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          deposit_id: string
          id: string
          occurred_at: string
          organization_id: string
          reason: string | null
          recorded_by: string | null
          reference: string | null
          transaction_type: Database["public"]["Enums"]["deposit_transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          deposit_id: string
          id?: string
          occurred_at?: string
          organization_id: string
          reason?: string | null
          recorded_by?: string | null
          reference?: string | null
          transaction_type: Database["public"]["Enums"]["deposit_transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          deposit_id?: string
          id?: string
          occurred_at?: string
          organization_id?: string
          reason?: string | null
          recorded_by?: string | null
          reference?: string | null
          transaction_type?: Database["public"]["Enums"]["deposit_transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "deposit_transactions_org_deposit_fkey"
            columns: ["organization_id", "deposit_id"]
            isOneToOne: false
            referencedRelation: "deposits"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount_paid: number
          amount_refunded: number
          amount_required: number
          amount_withheld: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          id: string
          kind: Database["public"]["Enums"]["deposit_kind"]
          lease_id: string
          organization_id: string
          remaining_due: number | null
          updated_at: string
          withholding_reason: string | null
        }
        Insert: {
          amount_paid?: number
          amount_refunded?: number
          amount_required: number
          amount_withheld?: number
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          kind: Database["public"]["Enums"]["deposit_kind"]
          lease_id: string
          organization_id: string
          remaining_due?: number | null
          updated_at?: string
          withholding_reason?: string | null
        }
        Update: {
          amount_paid?: number
          amount_refunded?: number
          amount_required?: number
          amount_withheld?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          kind?: Database["public"]["Enums"]["deposit_kind"]
          lease_id?: string
          organization_id?: string
          remaining_due?: number | null
          updated_at?: string
          withholding_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      documents: {
        Row: {
          bucket_id: string
          checksum_sha256: string | null
          created_at: string
          expense_id: string | null
          file_name: string
          file_size_bytes: number
          id: string
          is_sensitive: boolean
          kind: Database["public"]["Enums"]["document_kind"]
          lease_id: string | null
          maintenance_request_id: string | null
          mime_type: string
          organization_id: string
          property_id: string | null
          receipt_id: string | null
          storage_path: string
          tenant_id: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_id: string
          checksum_sha256?: string | null
          created_at?: string
          expense_id?: string | null
          file_name: string
          file_size_bytes: number
          id?: string
          is_sensitive?: boolean
          kind: Database["public"]["Enums"]["document_kind"]
          lease_id?: string | null
          maintenance_request_id?: string | null
          mime_type: string
          organization_id: string
          property_id?: string | null
          receipt_id?: string | null
          storage_path: string
          tenant_id?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_id?: string
          checksum_sha256?: string | null
          created_at?: string
          expense_id?: string | null
          file_name?: string
          file_size_bytes?: number
          id?: string
          is_sensitive?: boolean
          kind?: Database["public"]["Enums"]["document_kind"]
          lease_id?: string | null
          maintenance_request_id?: string | null
          mime_type?: string
          organization_id?: string
          property_id?: string | null
          receipt_id?: string | null
          storage_path?: string
          tenant_id?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_org_expense_fkey"
            columns: ["organization_id", "expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_org_maintenance_fkey"
            columns: ["organization_id", "maintenance_request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_org_property_fkey"
            columns: ["organization_id", "property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_org_receipt_fkey"
            columns: ["organization_id", "receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_org_tenant_fkey"
            columns: ["organization_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approved_by: string | null
          category: string
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description: string
          expense_number: string
          external_reference: string | null
          id: string
          incurred_on: string
          organization_id: string
          paid_at: string | null
          property_id: string
          status: Database["public"]["Enums"]["expense_status"]
          unit_id: string | null
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description: string
          expense_number: string
          external_reference?: string | null
          id?: string
          incurred_on: string
          organization_id: string
          paid_at?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["expense_status"]
          unit_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string
          expense_number?: string
          external_reference?: string | null
          id?: string
          incurred_on?: string
          organization_id?: string
          paid_at?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["expense_status"]
          unit_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_org_property_fkey"
            columns: ["organization_id", "property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "expenses_org_unit_property_fkey"
            columns: ["organization_id", "unit_id", "property_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["organization_id", "id", "property_id"]
          },
        ]
      }
      floors: {
        Row: {
          building_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          level_number: number
          name: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          building_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          level_number: number
          name?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          building_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          level_number?: number
          name?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "floors_org_building_fkey"
            columns: ["organization_id", "building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      lease_tenants: {
        Row: {
          created_at: string
          is_primary: boolean
          joined_at: string
          lease_id: string
          left_at: string | null
          organization_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          is_primary?: boolean
          joined_at: string
          lease_id: string
          left_at?: string | null
          organization_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          is_primary?: boolean
          joined_at?: string
          lease_id?: string
          left_at?: string | null
          organization_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lease_tenants_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "lease_tenants_org_tenant_fkey"
            columns: ["organization_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      leases: {
        Row: {
          activated_at: string | null
          advance_amount: number
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          custom_interval_months: number | null
          due_day: number
          end_date: string | null
          frequency: Database["public"]["Enums"]["billing_frequency"]
          guarantee_amount: number
          id: string
          lease_number: string
          organization_id: string
          rent_amount: number
          start_date: string
          status: Database["public"]["Enums"]["lease_status"]
          terminated_at: string | null
          termination_reason: string | null
          terms: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          advance_amount?: number
          created_at?: string
          created_by?: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          custom_interval_months?: number | null
          due_day?: number
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["billing_frequency"]
          guarantee_amount?: number
          id?: string
          lease_number: string
          organization_id: string
          rent_amount: number
          start_date: string
          status?: Database["public"]["Enums"]["lease_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          terms?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          advance_amount?: number
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          custom_interval_months?: number | null
          due_day?: number
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["billing_frequency"]
          guarantee_amount?: number
          id?: string
          lease_number?: string
          organization_id?: string
          rent_amount?: number
          start_date?: string
          status?: Database["public"]["Enums"]["lease_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          terms?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_org_unit_fkey"
            columns: ["organization_id", "unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          organization_id: string
          priority: Database["public"]["Enums"]["maintenance_priority"]
          property_id: string
          request_number: string
          requested_at: string
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          tenant_id: string | null
          title: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          organization_id: string
          priority?: Database["public"]["Enums"]["maintenance_priority"]
          property_id: string
          request_number: string
          requested_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          tenant_id?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          organization_id?: string
          priority?: Database["public"]["Enums"]["maintenance_priority"]
          property_id?: string
          request_number?: string
          requested_at?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          tenant_id?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_org_property_fkey"
            columns: ["organization_id", "property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "maintenance_org_tenant_fkey"
            columns: ["organization_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "maintenance_org_unit_property_fkey"
            columns: ["organization_id", "unit_id", "property_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["organization_id", "id", "property_id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          notification_id: string
          organization_id: string
          provider: string
          provider_message_id: string | null
          recipient: string
          retry_count: number
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["delivery_status"]
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          notification_id: string
          organization_id: string
          provider: string
          provider_message_id?: string | null
          recipient: string
          retry_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          notification_id?: string
          organization_id?: string
          provider?: string
          provider_message_id?: string | null
          recipient?: string
          retry_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          metadata: Json
          notification_type: Database["public"]["Enums"]["notification_type"]
          organization_id: string
          read_at: string | null
          recipient_user_id: string | null
          scheduled_at: string | null
          tenant_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          metadata?: Json
          notification_type: Database["public"]["Enums"]["notification_type"]
          organization_id: string
          read_at?: string | null
          recipient_user_id?: string | null
          scheduled_at?: string | null
          tenant_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          metadata?: Json
          notification_type?: Database["public"]["Enums"]["notification_type"]
          organization_id?: string
          read_at?: string | null
          recipient_user_id?: string | null
          scheduled_at?: string | null
          tenant_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_org_tenant_fkey"
            columns: ["organization_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      number_sequences: {
        Row: {
          entity_type: string
          last_value: number
          organization_id: string
          sequence_year: number
          updated_at: string
        }
        Insert: {
          entity_type: string
          last_value?: number
          organization_id: string
          sequence_year: number
          updated_at?: string
        }
        Update: {
          entity_type?: string
          last_value?: number
          organization_id?: string
          sequence_year?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "number_sequences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          permissions: Json
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          permissions?: Json
          role: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          permissions?: Json
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      organizations: {
        Row: {
          archived_at: string | null
          code: string
          created_at: string
          created_by: string | null
          default_currency: Database["public"]["Enums"]["currency_code"]
          id: string
          is_demo: boolean
          locale: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["organization_status"]
          timezone: string
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          default_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          is_demo?: boolean
          locale?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["organization_status"]
          timezone?: string
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          default_currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          is_demo?: boolean
          locale?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["organization_status"]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          allocated_at: string
          allocated_by: string | null
          allocation_type: Database["public"]["Enums"]["allocation_type"]
          amount: number
          id: string
          organization_id: string
          payment_id: string
          rent_invoice_id: string
        }
        Insert: {
          allocated_at?: string
          allocated_by?: string | null
          allocation_type?: Database["public"]["Enums"]["allocation_type"]
          amount: number
          id?: string
          organization_id: string
          payment_id: string
          rent_invoice_id: string
        }
        Update: {
          allocated_at?: string
          allocated_by?: string | null
          allocation_type?: Database["public"]["Enums"]["allocation_type"]
          amount?: number
          id?: string
          organization_id?: string
          payment_id?: string
          rent_invoice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_org_invoice_fkey"
            columns: ["organization_id", "rent_invoice_id"]
            isOneToOne: false
            referencedRelation: "rent_invoice_balances"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "payment_allocations_org_invoice_fkey"
            columns: ["organization_id", "rent_invoice_id"]
            isOneToOne: false
            referencedRelation: "rent_invoices"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "payment_allocations_org_payment_fkey"
            columns: ["organization_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      payment_reversals: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          original_amount: number
          payment_id: string
          reason: string
          reversed_at: string
          reversed_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          original_amount: number
          payment_id: string
          reason: string
          reversed_at?: string
          reversed_by: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          original_amount?: number
          payment_id?: string
          reason?: string
          reversed_at?: string
          reversed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reversals_org_payment_fkey"
            columns: ["organization_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          external_reference: string | null
          id: string
          idempotency_key: string
          lease_id: string
          method: Database["public"]["Enums"]["payment_method"]
          note: string | null
          organization_id: string
          paid_at: string
          payment_number: string
          received_by: string | null
          status: Database["public"]["Enums"]["payment_status"]
          tenant_id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          external_reference?: string | null
          id?: string
          idempotency_key?: string
          lease_id: string
          method: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          organization_id: string
          paid_at: string
          payment_number: string
          received_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          external_reference?: string | null
          id?: string
          idempotency_key?: string
          lease_id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          note?: string | null
          organization_id?: string
          paid_at?: string
          payment_number?: string
          received_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tenant_id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "payments_org_tenant_fkey"
            columns: ["organization_id", "tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "payments_org_unit_fkey"
            columns: ["organization_id", "unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferred_locale: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferred_locale?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_locale?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          archived_at: string | null
          city: string
          code: string
          commune: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          organization_id: string
          owner_user_id: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          province: string | null
          status: Database["public"]["Enums"]["property_status"]
          updated_at: string
        }
        Insert: {
          address: string
          archived_at?: string | null
          city: string
          code: string
          commune?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          organization_id: string
          owner_user_id?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          province?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string
        }
        Update: {
          address?: string
          archived_at?: string | null
          city?: string
          code?: string
          commune?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          organization_id?: string
          owner_user_id?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          province?: string | null
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          id: string
          issued_at: string
          issued_by: string | null
          organization_id: string
          payment_id: string
          public_token: string
          receipt_number: string
          status: Database["public"]["Enums"]["receipt_status"]
          storage_path: string | null
          updated_at: string
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          amount: number
          balance_after?: number
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          id?: string
          issued_at?: string
          issued_by?: string | null
          organization_id: string
          payment_id: string
          public_token?: string
          receipt_number: string
          status?: Database["public"]["Enums"]["receipt_status"]
          storage_path?: string | null
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          id?: string
          issued_at?: string
          issued_by?: string | null
          organization_id?: string
          payment_id?: string
          public_token?: string
          receipt_number?: string
          status?: Database["public"]["Enums"]["receipt_status"]
          storage_path?: string | null
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_org_payment_fkey"
            columns: ["organization_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      rent_invoices: {
        Row: {
          amount_due: number
          amount_paid: number
          balance: number | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          due_date: string
          id: string
          invoice_number: string
          lease_id: string
          organization_id: string
          period_end: string
          period_start: string
          rent_schedule_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          updated_at: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number
          balance?: number | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          due_date: string
          id?: string
          invoice_number: string
          lease_id: string
          organization_id: string
          period_end: string
          period_start: string
          rent_schedule_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number
          balance?: number | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          due_date?: string
          id?: string
          invoice_number?: string
          lease_id?: string
          organization_id?: string
          period_end?: string
          period_start?: string
          rent_schedule_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_invoices_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "rent_invoices_org_schedule_fkey"
            columns: ["organization_id", "rent_schedule_id"]
            isOneToOne: false
            referencedRelation: "rent_schedules"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      rent_schedules: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          custom_interval_months: number | null
          due_day: number
          effective_from: string
          effective_until: string | null
          frequency: Database["public"]["Enums"]["billing_frequency"]
          id: string
          lease_id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          custom_interval_months?: number | null
          due_day: number
          effective_from: string
          effective_until?: string | null
          frequency: Database["public"]["Enums"]["billing_frequency"]
          id?: string
          lease_id: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          custom_interval_months?: number | null
          due_day?: number
          effective_from?: string
          effective_until?: string | null
          frequency?: Database["public"]["Enums"]["billing_frequency"]
          id?: string
          lease_id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_schedules_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      tenants: {
        Row: {
          archived_at: string | null
          auth_user_id: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          identity_document_number: string | null
          identity_document_type:
            | Database["public"]["Enums"]["identity_document_type"]
            | null
          last_name: string
          middle_name: string | null
          notes: string | null
          organization_id: string
          phone: string
          previous_address: string | null
          profession: string | null
          tenant_number: string
          updated_at: string
          whatsapp_phone: string | null
        }
        Insert: {
          archived_at?: string | null
          auth_user_id?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          identity_document_number?: string | null
          identity_document_type?:
            | Database["public"]["Enums"]["identity_document_type"]
            | null
          last_name: string
          middle_name?: string | null
          notes?: string | null
          organization_id: string
          phone: string
          previous_address?: string | null
          profession?: string | null
          tenant_number: string
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Update: {
          archived_at?: string | null
          auth_user_id?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          identity_document_number?: string | null
          identity_document_type?:
            | Database["public"]["Enums"]["identity_document_type"]
            | null
          last_name?: string
          middle_name?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string
          previous_address?: string | null
          profession?: string | null
          tenant_number?: string
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_photos: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number
          id: string
          is_cover: boolean
          mime_type: string
          organization_id: string
          room_label: string | null
          sort_order: number
          storage_path: string
          unit_id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes: number
          id?: string
          is_cover?: boolean
          mime_type: string
          organization_id: string
          room_label?: string | null
          sort_order?: number
          storage_path: string
          unit_id: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number
          id?: string
          is_cover?: boolean
          mime_type?: string
          organization_id?: string
          room_label?: string | null
          sort_order?: number
          storage_path?: string
          unit_id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_photos_org_unit_fkey"
            columns: ["organization_id", "unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      units: {
        Row: {
          archived_at: string | null
          area_square_meters: number | null
          bathrooms: number
          bedrooms: number
          building_id: string | null
          code: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          description: string | null
          floor_id: string | null
          has_balcony: boolean
          has_garage: boolean
          has_yard: boolean
          id: string
          indicative_rent: number | null
          kitchens: number
          living_rooms: number
          organization_id: string
          property_id: string
          status: Database["public"]["Enums"]["unit_status"]
          toilets: number
          unit_number: string | null
          unit_type: Database["public"]["Enums"]["unit_type"]
          updated_at: string
        }
        Insert: {
          archived_at?: string | null
          area_square_meters?: number | null
          bathrooms?: number
          bedrooms?: number
          building_id?: string | null
          code: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          floor_id?: string | null
          has_balcony?: boolean
          has_garage?: boolean
          has_yard?: boolean
          id?: string
          indicative_rent?: number | null
          kitchens?: number
          living_rooms?: number
          organization_id: string
          property_id: string
          status?: Database["public"]["Enums"]["unit_status"]
          toilets?: number
          unit_number?: string | null
          unit_type: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
        }
        Update: {
          archived_at?: string | null
          area_square_meters?: number | null
          bathrooms?: number
          bedrooms?: number
          building_id?: string | null
          code?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          floor_id?: string | null
          has_balcony?: boolean
          has_garage?: boolean
          has_yard?: boolean
          id?: string
          indicative_rent?: number | null
          kitchens?: number
          living_rooms?: number
          organization_id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          toilets?: number
          unit_number?: string | null
          unit_type?: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_org_building_property_fkey"
            columns: ["organization_id", "building_id", "property_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["organization_id", "id", "property_id"]
          },
          {
            foreignKeyName: "units_org_floor_building_fkey"
            columns: ["organization_id", "floor_id", "building_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["organization_id", "id", "building_id"]
          },
          {
            foreignKeyName: "units_org_property_fkey"
            columns: ["organization_id", "property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
    }
    Views: {
      rent_arrears: {
        Row: {
          currency: Database["public"]["Enums"]["currency_code"] | null
          invoice_count: number | null
          lease_id: string | null
          maximum_days_late: number | null
          oldest_due_date: string | null
          organization_id: string | null
          tenant_id: string | null
          total_balance: number | null
          unit_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rent_invoices_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      rent_invoice_balances: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          balance: number | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          days_late: number | null
          due_date: string | null
          id: string | null
          invoice_number: string | null
          lease_id: string | null
          organization_id: string | null
          period_end: string | null
          period_start: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          balance?: number | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          days_late?: never
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          lease_id?: string | null
          organization_id?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: never
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          balance?: number | null
          currency?: Database["public"]["Enums"]["currency_code"] | null
          days_late?: never
          due_date?: string | null
          id?: string | null
          invoice_number?: string | null
          lease_id?: string | null
          organization_id?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: never
        }
        Relationships: [
          {
            foreignKeyName: "rent_invoices_org_lease_fkey"
            columns: ["organization_id", "lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
    }
    Functions: {
      bootstrap_owner_organization: {
        Args: { p_code?: string; p_name?: string }
        Returns: string
      }
      calculate_invoice_status: {
        Args: {
          p_amount_due: number
          p_amount_paid: number
          p_as_of_date?: string
          p_due_date: string
        }
        Returns: Database["public"]["Enums"]["invoice_status"]
      }
      create_lease_with_tenant: {
        Args: {
          p_advance_amount?: number
          p_currency: Database["public"]["Enums"]["currency_code"]
          p_due_day?: number
          p_end_date: string | null
          p_frequency?: Database["public"]["Enums"]["billing_frequency"]
          p_guarantee_amount?: number
          p_organization_id: string
          p_rent_amount: number
          p_start_date: string
          p_tenant_id: string
          p_terms?: string
          p_unit_id: string
        }
        Returns: string
      }
      create_lease_and_invoices: {
        Args: {
          p_advance_amount?: number
          p_currency: Database["public"]["Enums"]["currency_code"]
          p_due_day?: number
          p_end_date: string | null
          p_frequency?: Database["public"]["Enums"]["billing_frequency"]
          p_guarantee_amount?: number
          p_organization_id: string
          p_rent_amount: number
          p_start_date: string
          p_tenant_id: string
          p_terms?: string
          p_unit_id: string
        }
        Returns: string
      }
      create_open_lease_and_invoices: {
        Args: {
          p_advance_amount?: number
          p_currency: Database["public"]["Enums"]["currency_code"]
          p_due_day?: number
          p_frequency?: Database["public"]["Enums"]["billing_frequency"]
          p_guarantee_amount?: number
          p_organization_id: string
          p_rent_amount: number
          p_start_date: string
          p_tenant_id: string
          p_terms?: string
          p_unit_id: string
        }
        Returns: string
      }
      create_tenant_record: {
        Args: {
          p_email?: string
          p_emergency_name?: string
          p_emergency_phone?: string
          p_first_name: string
          p_identity_number?: string
          p_identity_type?: Database["public"]["Enums"]["identity_document_type"]
          p_last_name: string
          p_organization_id: string
          p_phone: string
          p_previous_address?: string
        }
        Returns: string
      }
      generate_rent_invoices: {
        Args: { p_organization_id: string; p_through_date?: string }
        Returns: number
      }
      next_human_number: {
        Args: {
          p_entity_type: string
          p_organization_id: string
          p_padding?: number
          p_prefix: string
          p_year?: number
        }
        Returns: string
      }
      record_rent_payment: {
        Args: {
          p_amount: number
          p_currency: Database["public"]["Enums"]["currency_code"]
          p_external_reference?: string
          p_idempotency_key?: string
          p_lease_id: string
          p_method: Database["public"]["Enums"]["payment_method"]
          p_note?: string
          p_organization_id: string
          p_paid_at: string
          p_tenant_id: string
        }
        Returns: string
      }
      rollback_lease_creation: {
        Args: { p_lease_id: string; p_organization_id: string }
        Returns: undefined
      }
    }
    Enums: {
      allocation_type: "automatic" | "manual"
      app_permission:
        | "organization.read"
        | "organization.update"
        | "members.read"
        | "members.manage"
        | "portfolio.read"
        | "portfolio.manage"
        | "tenants.read"
        | "tenants.manage"
        | "leases.read"
        | "leases.manage"
        | "finance.read"
        | "finance.manage"
        | "payments.create"
        | "notifications.read"
        | "notifications.manage"
        | "documents.read"
        | "documents.manage"
        | "settings.read"
        | "settings.manage"
        | "reports.read"
        | "audit.read"
        | "portal.read"
        | "maintenance.create"
      app_role: "super_admin" | "owner" | "manager" | "cashier" | "tenant"
      billing_frequency:
        | "monthly"
        | "quarterly"
        | "semiannual"
        | "annual"
        | "custom"
      currency_code: "USD" | "CDF"
      delivery_status:
        | "pending"
        | "scheduled"
        | "sent"
        | "delivered"
        | "failed"
        | "cancelled"
      deposit_kind: "guarantee" | "advance"
      deposit_transaction_type:
        | "payment"
        | "refund"
        | "withholding"
        | "adjustment"
      document_kind:
        | "tenant_photo"
        | "property_image"
        | "identity_document"
        | "lease_document"
        | "receipt"
        | "expense_proof"
        | "maintenance_attachment"
        | "other"
      expense_status: "draft" | "approved" | "paid" | "cancelled"
      gender_type: "female" | "male" | "other" | "unspecified"
      identity_document_type:
        | "national_id"
        | "passport"
        | "driving_license"
        | "voter_card"
        | "other"
      invoice_status:
        | "upcoming"
        | "due_soon"
        | "due_today"
        | "partial"
        | "paid"
        | "late"
        | "unpaid"
        | "arrears"
      lease_status: "draft" | "active" | "suspended" | "terminated" | "expired"
      maintenance_priority: "low" | "normal" | "high" | "urgent"
      maintenance_status:
        | "open"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "cancelled"
      membership_status: "invited" | "active" | "suspended"
      notification_channel: "in_app" | "whatsapp" | "sms" | "email"
      notification_type:
        | "payment_received"
        | "payment_partial"
        | "payment_due_soon"
        | "payment_due_today"
        | "payment_late"
        | "payment_overdue"
        | "lease_expiring"
        | "system"
      organization_status: "active" | "suspended" | "archived"
      payment_method:
        | "cash"
        | "mobile_money"
        | "bank_transfer"
        | "bank_deposit"
        | "other"
      payment_status: "pending" | "completed" | "reversed" | "cancelled"
      property_status: "active" | "inactive" | "archived"
      property_type:
        | "building"
        | "plot"
        | "residence"
        | "house"
        | "villa"
        | "residential_complex"
        | "commercial"
        | "other"
      receipt_status: "issued" | "void"
      unit_status:
        | "available"
        | "occupied"
        | "reserved"
        | "maintenance"
        | "unavailable"
      unit_type:
        | "apartment"
        | "studio"
        | "house"
        | "room"
        | "office"
        | "shop"
        | "warehouse"
        | "other"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      allocation_type: ["automatic", "manual"],
      app_permission: [
        "organization.read",
        "organization.update",
        "members.read",
        "members.manage",
        "portfolio.read",
        "portfolio.manage",
        "tenants.read",
        "tenants.manage",
        "leases.read",
        "leases.manage",
        "finance.read",
        "finance.manage",
        "payments.create",
        "notifications.read",
        "notifications.manage",
        "documents.read",
        "documents.manage",
        "settings.read",
        "settings.manage",
        "reports.read",
        "audit.read",
        "portal.read",
        "maintenance.create",
      ],
      app_role: ["super_admin", "owner", "manager", "cashier", "tenant"],
      billing_frequency: [
        "monthly",
        "quarterly",
        "semiannual",
        "annual",
        "custom",
      ],
      currency_code: ["USD", "CDF"],
      delivery_status: [
        "pending",
        "scheduled",
        "sent",
        "delivered",
        "failed",
        "cancelled",
      ],
      deposit_kind: ["guarantee", "advance"],
      deposit_transaction_type: [
        "payment",
        "refund",
        "withholding",
        "adjustment",
      ],
      document_kind: [
        "tenant_photo",
        "property_image",
        "identity_document",
        "lease_document",
        "receipt",
        "expense_proof",
        "maintenance_attachment",
        "other",
      ],
      expense_status: ["draft", "approved", "paid", "cancelled"],
      gender_type: ["female", "male", "other", "unspecified"],
      identity_document_type: [
        "national_id",
        "passport",
        "driving_license",
        "voter_card",
        "other",
      ],
      invoice_status: [
        "upcoming",
        "due_soon",
        "due_today",
        "partial",
        "paid",
        "late",
        "unpaid",
        "arrears",
      ],
      lease_status: ["draft", "active", "suspended", "terminated", "expired"],
      maintenance_priority: ["low", "normal", "high", "urgent"],
      maintenance_status: [
        "open",
        "assigned",
        "in_progress",
        "resolved",
        "cancelled",
      ],
      membership_status: ["invited", "active", "suspended"],
      notification_channel: ["in_app", "whatsapp", "sms", "email"],
      notification_type: [
        "payment_received",
        "payment_partial",
        "payment_due_soon",
        "payment_due_today",
        "payment_late",
        "payment_overdue",
        "lease_expiring",
        "system",
      ],
      organization_status: ["active", "suspended", "archived"],
      payment_method: [
        "cash",
        "mobile_money",
        "bank_transfer",
        "bank_deposit",
        "other",
      ],
      payment_status: ["pending", "completed", "reversed", "cancelled"],
      property_status: ["active", "inactive", "archived"],
      property_type: [
        "building",
        "plot",
        "residence",
        "house",
        "villa",
        "residential_complex",
        "commercial",
        "other",
      ],
      receipt_status: ["issued", "void"],
      unit_status: [
        "available",
        "occupied",
        "reserved",
        "maintenance",
        "unavailable",
      ],
      unit_type: [
        "apartment",
        "studio",
        "house",
        "room",
        "office",
        "shop",
        "warehouse",
        "other",
      ],
    },
  },
} as const
