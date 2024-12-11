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
      activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_carbon_metrics: {
        Row: {
          actual_cdr: number | null
          biochar_batch_id: string | null
          biochar_carbon_content: number | null
          biomass_carbon_content: number | null
          biomass_transport_emissions: number | null
          carbon_footprint_per_kg: number | null
          carbon_stability_factor: number | null
          cdr_per_kg: number | null
          created_at: string | null
          energy_emissions: number | null
          farmer_id: string | null
          id: string
          potential_cdr: number | null
          production_emissions: number | null
          total_carbon_footprint: number | null
          updated_at: string | null
          water_emissions: number | null
        }
        Insert: {
          actual_cdr?: number | null
          biochar_batch_id?: string | null
          biochar_carbon_content?: number | null
          biomass_carbon_content?: number | null
          biomass_transport_emissions?: number | null
          carbon_footprint_per_kg?: number | null
          carbon_stability_factor?: number | null
          cdr_per_kg?: number | null
          created_at?: string | null
          energy_emissions?: number | null
          farmer_id?: string | null
          id?: string
          potential_cdr?: number | null
          production_emissions?: number | null
          total_carbon_footprint?: number | null
          updated_at?: string | null
          water_emissions?: number | null
        }
        Update: {
          actual_cdr?: number | null
          biochar_batch_id?: string | null
          biochar_carbon_content?: number | null
          biomass_carbon_content?: number | null
          biomass_transport_emissions?: number | null
          carbon_footprint_per_kg?: number | null
          carbon_stability_factor?: number | null
          cdr_per_kg?: number | null
          created_at?: string | null
          energy_emissions?: number | null
          farmer_id?: string | null
          id?: string
          potential_cdr?: number | null
          production_emissions?: number | null
          total_carbon_footprint?: number | null
          updated_at?: string | null
          water_emissions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_carbon_metrics_biochar_batch_id_fkey"
            columns: ["biochar_batch_id"]
            isOneToOne: true
            referencedRelation: "biochar_production"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_carbon_metrics_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      biochar_application: {
        Row: {
          application_date: string
          application_method: string | null
          area_covered: number | null
          created_at: string
          fertilizer_id: string | null
          fertilizer_quantity: number | null
          id: string
          mixture_ratio: string | null
          notes: string | null
          parcel_id: string
          quantity_used: number
          soil_conditions: string | null
          storage_id: string
          updated_at: string
          weather_conditions: string | null
        }
        Insert: {
          application_date: string
          application_method?: string | null
          area_covered?: number | null
          created_at?: string
          fertilizer_id?: string | null
          fertilizer_quantity?: number | null
          id?: string
          mixture_ratio?: string | null
          notes?: string | null
          parcel_id: string
          quantity_used: number
          soil_conditions?: string | null
          storage_id: string
          updated_at?: string
          weather_conditions?: string | null
        }
        Update: {
          application_date?: string
          application_method?: string | null
          area_covered?: number | null
          created_at?: string
          fertilizer_id?: string | null
          fertilizer_quantity?: number | null
          id?: string
          mixture_ratio?: string | null
          notes?: string | null
          parcel_id?: string
          quantity_used?: number
          soil_conditions?: string | null
          storage_id?: string
          updated_at?: string
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biochar_application_fertilizer_id_fkey"
            columns: ["fertilizer_id"]
            isOneToOne: false
            referencedRelation: "fertilizer_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biochar_application_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biochar_application_storage_id_fkey"
            columns: ["storage_id"]
            isOneToOne: false
            referencedRelation: "biochar_storage"
            referencedColumns: ["id"]
          },
        ]
      }
      biochar_production: {
        Row: {
          batch_number: string
          biochar_weight: number | null
          biomass_id: string | null
          biomass_weight: number
          combustion_temperature: number | null
          created_at: string
          end_time: string
          farmer_id: string
          id: string
          production_date: string
          production_notes: string | null
          quality_parameters: Json | null
          start_time: string
          status: string | null
          updated_at: string
          water_usage: number | null
          yield_percentage: number | null
        }
        Insert: {
          batch_number: string
          biochar_weight?: number | null
          biomass_id?: string | null
          biomass_weight: number
          combustion_temperature?: number | null
          created_at?: string
          end_time: string
          farmer_id: string
          id?: string
          production_date: string
          production_notes?: string | null
          quality_parameters?: Json | null
          start_time: string
          status?: string | null
          updated_at?: string
          water_usage?: number | null
          yield_percentage?: number | null
        }
        Update: {
          batch_number?: string
          biochar_weight?: number | null
          biomass_id?: string | null
          biomass_weight?: number
          combustion_temperature?: number | null
          created_at?: string
          end_time?: string
          farmer_id?: string
          id?: string
          production_date?: string
          production_notes?: string | null
          quality_parameters?: Json | null
          start_time?: string
          status?: string | null
          updated_at?: string
          water_usage?: number | null
          yield_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "biochar_production_biomass_id_fkey"
            columns: ["biomass_id"]
            isOneToOne: false
            referencedRelation: "biomass_production"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biochar_production_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      biochar_storage: {
        Row: {
          biochar_id: string
          created_at: string
          farmer_id: string
          id: string
          quality_check_date: string | null
          quality_parameters: Json | null
          quantity_remaining: number
          quantity_stored: number
          status: string | null
          storage_conditions: string | null
          storage_date: string
          storage_location: string
          updated_at: string
        }
        Insert: {
          biochar_id: string
          created_at?: string
          farmer_id: string
          id?: string
          quality_check_date?: string | null
          quality_parameters?: Json | null
          quantity_remaining: number
          quantity_stored: number
          status?: string | null
          storage_conditions?: string | null
          storage_date: string
          storage_location: string
          updated_at?: string
        }
        Update: {
          biochar_id?: string
          created_at?: string
          farmer_id?: string
          id?: string
          quality_check_date?: string | null
          quality_parameters?: Json | null
          quantity_remaining?: number
          quantity_stored?: number
          status?: string | null
          storage_conditions?: string | null
          storage_date?: string
          storage_location?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "biochar_storage_biochar_id_fkey"
            columns: ["biochar_id"]
            isOneToOne: true
            referencedRelation: "biochar_production"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biochar_storage_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      biomass_production: {
        Row: {
          biomass_quantity: number | null
          biomass_remaining: number | null
          biomass_storage_conditions: string | null
          biomass_storage_date: string | null
          biomass_storage_location: string | null
          biomass_storage_proof_url: string | null
          biomass_used: number | null
          created_at: string
          crop_type: string
          crop_yield: number | null
          farmer_id: string
          harvest_date: string
          id: string
          moisture_content: number | null
          notes: string | null
          parcel_id: string
          quality_grade: string | null
          residue_generated: number | null
          residue_remaining: number | null
          residue_storage_conditions: string | null
          residue_storage_date: string | null
          residue_storage_location: string | null
          residue_storage_proof_url: string | null
          residue_used: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          biomass_quantity?: number | null
          biomass_remaining?: number | null
          biomass_storage_conditions?: string | null
          biomass_storage_date?: string | null
          biomass_storage_location?: string | null
          biomass_storage_proof_url?: string | null
          biomass_used?: number | null
          created_at?: string
          crop_type: string
          crop_yield?: number | null
          farmer_id: string
          harvest_date: string
          id?: string
          moisture_content?: number | null
          notes?: string | null
          parcel_id: string
          quality_grade?: string | null
          residue_generated?: number | null
          residue_remaining?: number | null
          residue_storage_conditions?: string | null
          residue_storage_date?: string | null
          residue_storage_location?: string | null
          residue_storage_proof_url?: string | null
          residue_used?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          biomass_quantity?: number | null
          biomass_remaining?: number | null
          biomass_storage_conditions?: string | null
          biomass_storage_date?: string | null
          biomass_storage_location?: string | null
          biomass_storage_proof_url?: string | null
          biomass_used?: number | null
          created_at?: string
          crop_type?: string
          crop_yield?: number | null
          farmer_id?: string
          harvest_date?: string
          id?: string
          moisture_content?: number | null
          notes?: string | null
          parcel_id?: string
          quality_grade?: string | null
          residue_generated?: number | null
          residue_remaining?: number | null
          residue_storage_conditions?: string | null
          residue_storage_date?: string | null
          residue_storage_location?: string | null
          residue_storage_proof_url?: string | null
          residue_used?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "biomass_production_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biomass_production_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      biomass_usage: {
        Row: {
          biochar_id: string
          biomass_id: string
          created_at: string | null
          id: string
          quantity_used: number
          updated_at: string | null
          usage_date: string
        }
        Insert: {
          biochar_id: string
          biomass_id: string
          created_at?: string | null
          id?: string
          quantity_used: number
          updated_at?: string | null
          usage_date: string
        }
        Update: {
          biochar_id?: string
          biomass_id?: string
          created_at?: string | null
          id?: string
          quantity_used?: number
          updated_at?: string | null
          usage_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "biomass_usage_biochar_id_fkey"
            columns: ["biochar_id"]
            isOneToOne: false
            referencedRelation: "biochar_production"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biomass_usage_biomass_id_fkey"
            columns: ["biomass_id"]
            isOneToOne: false
            referencedRelation: "biomass_production"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_footprint: {
        Row: {
          application_emissions: number | null
          biochar_stable_carbon: number | null
          biomass_sequestered_co2: number | null
          biomass_transport_emissions: number | null
          created_at: string | null
          farmer_id: string | null
          fertilizer_reduction_benefit: number | null
          id: string
          month: string
          net_carbon_impact: number | null
          production_emissions: number | null
          total_emissions: number | null
          total_sequestered: number | null
          updated_at: string | null
          water_usage_emissions: number | null
        }
        Insert: {
          application_emissions?: number | null
          biochar_stable_carbon?: number | null
          biomass_sequestered_co2?: number | null
          biomass_transport_emissions?: number | null
          created_at?: string | null
          farmer_id?: string | null
          fertilizer_reduction_benefit?: number | null
          id?: string
          month: string
          net_carbon_impact?: number | null
          production_emissions?: number | null
          total_emissions?: number | null
          total_sequestered?: number | null
          updated_at?: string | null
          water_usage_emissions?: number | null
        }
        Update: {
          application_emissions?: number | null
          biochar_stable_carbon?: number | null
          biomass_sequestered_co2?: number | null
          biomass_transport_emissions?: number | null
          created_at?: string | null
          farmer_id?: string | null
          fertilizer_reduction_benefit?: number | null
          id?: string
          month?: string
          net_carbon_impact?: number | null
          production_emissions?: number | null
          total_emissions?: number | null
          total_sequestered?: number | null
          updated_at?: string | null
          water_usage_emissions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_footprint_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fertilizer_inventory: {
        Row: {
          batch_number: string | null
          created_at: string
          farmer_id: string
          fertilizer_type: string | null
          id: string
          manufacturer: string | null
          name: string
          purchase_date: string
          purchase_proof_url: string | null
          quantity: number
          status: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          farmer_id: string
          fertilizer_type?: string | null
          id?: string
          manufacturer?: string | null
          name: string
          purchase_date: string
          purchase_proof_url?: string | null
          quantity: number
          status?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          farmer_id?: string
          fertilizer_type?: string | null
          id?: string
          manufacturer?: string | null
          name?: string
          purchase_date?: string
          purchase_proof_url?: string | null
          quantity?: number
          status?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fertilizer_inventory_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fertilizer_usage: {
        Row: {
          application_date: string
          created_at: string
          id: string
          inventory_id: string
          notes: string | null
          parcel_id: string
          purpose: string | null
          quantity_used: number
          updated_at: string
        }
        Insert: {
          application_date: string
          created_at?: string
          id?: string
          inventory_id: string
          notes?: string | null
          parcel_id: string
          purpose?: string | null
          quantity_used: number
          updated_at?: string
        }
        Update: {
          application_date?: string
          created_at?: string
          id?: string
          inventory_id?: string
          notes?: string | null
          parcel_id?: string
          purpose?: string | null
          quantity_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fertilizer_usage_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "fertilizer_inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fertilizer_usage_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      land_parcels: {
        Row: {
          available_storage_area: number | null
          avg_crop_yield: number | null
          avg_residue_consumption: number | null
          avg_residue_yield: number | null
          biochar_facility_distance: number | null
          created_at: string
          cultivable_area: number | null
          farmer_id: string
          gps_coordinates: string | null
          id: string
          parcel_name: string
          shape_file_url: string | null
          status: string | null
          storage_facility_distance: number | null
          total_area: number | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          available_storage_area?: number | null
          avg_crop_yield?: number | null
          avg_residue_consumption?: number | null
          avg_residue_yield?: number | null
          biochar_facility_distance?: number | null
          created_at?: string
          cultivable_area?: number | null
          farmer_id: string
          gps_coordinates?: string | null
          id?: string
          parcel_name: string
          shape_file_url?: string | null
          status?: string | null
          storage_facility_distance?: number | null
          total_area?: number | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          available_storage_area?: number | null
          avg_crop_yield?: number | null
          avg_residue_consumption?: number | null
          avg_residue_yield?: number | null
          biochar_facility_distance?: number | null
          created_at?: string
          cultivable_area?: number | null
          farmer_id?: string
          gps_coordinates?: string | null
          id?: string
          parcel_name?: string
          shape_file_url?: string | null
          status?: string | null
          storage_facility_distance?: number | null
          total_area?: number | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_parcels_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parcel_documents: {
        Row: {
          created_at: string
          document_name: string | null
          document_type: string | null
          document_url: string
          id: string
          parcel_id: string
          status: string | null
          updated_at: string
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_name?: string | null
          document_type?: string | null
          document_url: string
          id?: string
          parcel_id: string
          status?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_name?: string | null
          document_type?: string | null
          document_url?: string
          id?: string
          parcel_id?: string
          status?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_documents_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcel_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      production_metrics: {
        Row: {
          active_parcels: number | null
          average_yield_percentage: number | null
          biochar_remaining: number | null
          biochar_used: number | null
          biomass_remaining: number | null
          biomass_used: number | null
          created_at: string
          farmer_id: string
          id: string
          month: string
          total_biochar_produced: number | null
          total_biomass_produced: number | null
          total_storage_used: number | null
          total_water_used: number | null
          updated_at: string
        }
        Insert: {
          active_parcels?: number | null
          average_yield_percentage?: number | null
          biochar_remaining?: number | null
          biochar_used?: number | null
          biomass_remaining?: number | null
          biomass_used?: number | null
          created_at?: string
          farmer_id: string
          id?: string
          month: string
          total_biochar_produced?: number | null
          total_biomass_produced?: number | null
          total_storage_used?: number | null
          total_water_used?: number | null
          updated_at?: string
        }
        Update: {
          active_parcels?: number | null
          average_yield_percentage?: number | null
          biochar_remaining?: number | null
          biochar_used?: number | null
          biomass_remaining?: number | null
          biomass_used?: number | null
          created_at?: string
          farmer_id?: string
          id?: string
          month?: string
          total_biochar_produced?: number | null
          total_biomass_produced?: number | null
          total_storage_used?: number | null
          total_water_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_metrics_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          carbon_rights_agreement: boolean | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          land_ownership_status: boolean | null
          num_of_cattle: number | null
          phone_number: string | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          carbon_rights_agreement?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          land_ownership_status?: boolean | null
          num_of_cattle?: number | null
          phone_number?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          carbon_rights_agreement?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          land_ownership_status?: boolean | null
          num_of_cattle?: number | null
          phone_number?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_batch_carbon_metrics: {
        Args: {
          batch_id: string
        }
        Returns: undefined
      }
      calculate_carbon_footprint: {
        Args: {
          p_farmer_id: string
          p_month: string
        }
        Returns: undefined
      }
      get_available_biochar_batches: {
        Args: {
          p_farmer_id: string
        }
        Returns: {
          id: string
          batch_number: string
          biochar_weight: number
          production_date: string
          biomass_id: string
        }[]
      }
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

