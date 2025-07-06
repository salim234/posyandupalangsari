
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
      analysis_records: {
        Row: {
          analysis_text: string
          child_id: string
          created_at: string
          date: string
          id: string
          kader_id: string
          kader_name: string
        }
        Insert: {
          analysis_text: string
          child_id: string
          created_at?: string
          date: string
          id?: string
          kader_id: string
          kader_name: string
        }
        Update: {
          analysis_text?: string
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          kader_id?: string
          kader_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_records_childId_fkey"
            columns: ["child_id"]
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_records_kaderId_fkey"
            columns: ["kader_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          author_name: string
          author_role: Database["public"]["Enums"]["role_enum"]
          category: Database["public"]["Enums"]["article_category_enum"]
          content: string
          created_at: string
          id: string
          image_url: string
          published_date: string
          summary: string
          title: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          author_role: Database["public"]["Enums"]["role_enum"]
          category: Database["public"]["Enums"]["article_category_enum"]
          content: string
          created_at?: string
          id?: string
          image_url: string
          published_date: string
          summary: string
          title: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_role?: Database["public"]["Enums"]["role_enum"]
          category?: Database["public"]["Enums"]["article_category_enum"]
          content?: string
          created_at?: string
          id?: string
          image_url?: string
          published_date?: string
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_authorId_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string
          father_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"]
          id: string
          kk: string | null
          mother_name: string | null
          name: string
          nik: string | null
          parent_id: string
          place_of_birth: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth: string
          father_name?: string | null
          gender: Database["public"]["Enums"]["gender_enum"]
          id?: string
          kk?: string | null
          mother_name?: string | null
          name: string
          nik?: string | null
          parent_id: string
          place_of_birth?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string
          father_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"]
          id?: string
          kk?: string | null
          mother_name?: string | null
          name?: string
          nik?: string | null
          parent_id?: string
          place_of_birth?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_parentId_fkey"
            columns: ["parent_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_records: {
        Row: {
          age_in_months: number
          child_id: string
          created_at: string
          date: string
          head_circumference: number
          height: number
          id: string
          notes: string | null
          weight: number
        }
        Insert: {
          age_in_months: number
          child_id: string
          created_at?: string
          date: string
          head_circumference: number
          height: number
          id?: string
          notes?: string | null
          weight: number
        }
        Update: {
          age_in_months?: number
          child_id?: string
          created_at?: string
          date?: string
          head_circumference?: number
          height?: number
          id?: string
          notes?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "growth_records_childId_fkey"
            columns: ["child_id"]
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      immunization_records: {
        Row: {
          child_id: string
          created_at: string
          date: string
          id: string
          name: string
          notes: string | null
        }
        Insert: {
          child_id: string
          created_at?: string
          date: string
          id?: string
          name: string
          notes?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string
          date?: string
          id?: string
          name?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "immunization_records_childId_fkey"
            columns: ["child_id"]
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_records: {
        Row: {
          achieved_date: string
          child_id: string
          created_at: string
          id: string
          milestone_id: string
          notes: string | null
        }
        Insert: {
          achieved_date: string
          child_id: string
          created_at?: string
          id?: string
          milestone_id: string
          notes?: string | null
        }
        Update: {
          achieved_date?: string
          child_id?: string
          created_at?: string
          id?: string
          milestone_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestone_records_childId_fkey"
            columns: ["child_id"]
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link: string
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          name: string
          password: string
          role: Database["public"]["Enums"]["role_enum"]
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          password: string
          role: Database["public"]["Enums"]["role_enum"]
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          password?: string
          role?: Database["public"]["Enums"]["role_enum"]
          username?: string
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
      article_category_enum:
        | "Pengumuman"
        | "Gizi"
        | "Perkembangan"
        | "Kesehatan Umum"
      gender_enum: "Laki-laki" | "Perempuan"
      notification_type_enum:
        | "ANALISIS_BARU"
        | "CATATAN_PERTUMBUHAN_BARU"
        | "PENCAPAIAN_BARU"
        | "ARTIKEL_BARU"
      role_enum: "Admin" | "Kader" | "Warga"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
