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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cartoes_luto: {
        Row: {
          created_at: string
          falecido_id: string | null
          foto_path: string | null
          id: string
          mensagem: string | null
          publicado: boolean
          slug: string
          template_usado: string | null
          titulo: string
          updated_at: string
          url_arquivo: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          falecido_id?: string | null
          foto_path?: string | null
          id?: string
          mensagem?: string | null
          publicado?: boolean
          slug: string
          template_usado?: string | null
          titulo: string
          updated_at?: string
          url_arquivo?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          falecido_id?: string | null
          foto_path?: string | null
          id?: string
          mensagem?: string | null
          publicado?: boolean
          slug?: string
          template_usado?: string | null
          titulo?: string
          updated_at?: string
          url_arquivo?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cartoes_luto_falecido_id_fkey"
            columns: ["falecido_id"]
            isOneToOne: false
            referencedRelation: "falecidos"
            referencedColumns: ["id"]
          },
        ]
      }
      contratacoes: {
        Row: {
          carencia_ate: string | null
          created_at: string
          data_inicio: string
          dependentes: number
          id: string
          plano_id: string
          status: Database["public"]["Enums"]["contratacao_status"]
          updated_at: string
          user_id: string
          valor_mensal: number
        }
        Insert: {
          carencia_ate?: string | null
          created_at?: string
          data_inicio?: string
          dependentes?: number
          id?: string
          plano_id: string
          status?: Database["public"]["Enums"]["contratacao_status"]
          updated_at?: string
          user_id: string
          valor_mensal: number
        }
        Update: {
          carencia_ate?: string | null
          created_at?: string
          data_inicio?: string
          dependentes?: number
          id?: string
          plano_id?: string
          status?: Database["public"]["Enums"]["contratacao_status"]
          updated_at?: string
          user_id?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratacoes_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          arquivo_path: string | null
          created_at: string
          id: string
          observacao_admin: string | null
          status: Database["public"]["Enums"]["doc_status"]
          tipo_id: string
          updated_at: string
          user_id: string
          validado_em: string | null
          validado_por: string | null
        }
        Insert: {
          arquivo_path?: string | null
          created_at?: string
          id?: string
          observacao_admin?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          tipo_id: string
          updated_at?: string
          user_id: string
          validado_em?: string | null
          validado_por?: string | null
        }
        Update: {
          arquivo_path?: string | null
          created_at?: string
          id?: string
          observacao_admin?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          tipo_id?: string
          updated_at?: string
          user_id?: string
          validado_em?: string | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_documento"
            referencedColumns: ["id"]
          },
        ]
      }
      falecidos: {
        Row: {
          cpf: string | null
          created_at: string
          data_falecimento: string | null
          data_nascimento: string | null
          id: string
          nome: string
          observacoes: string | null
          parentesco: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_falecimento?: string | null
          data_nascimento?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          parentesco?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_falecimento?: string | null
          data_nascimento?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          parentesco?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funerarias: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          logo_url: string | null
          razao_social: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          razao_social: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          razao_social?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planos: {
        Row: {
          ativo: boolean
          beneficios: Json
          created_at: string
          descricao: string
          destaque: boolean
          funeraria_id: string | null
          id: string
          titulo: string
          updated_at: string
          valor_mensal: number
        }
        Insert: {
          ativo?: boolean
          beneficios?: Json
          created_at?: string
          descricao: string
          destaque?: boolean
          funeraria_id?: string | null
          id?: string
          titulo: string
          updated_at?: string
          valor_mensal: number
        }
        Update: {
          ativo?: boolean
          beneficios?: Json
          created_at?: string
          descricao?: string
          destaque?: boolean
          funeraria_id?: string | null
          id?: string
          titulo?: string
          updated_at?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "planos_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      processo_etapas: {
        Row: {
          acao: string | null
          concluido: boolean
          created_at: string
          id: string
          ordem: number
          subtitulo: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acao?: string | null
          concluido?: boolean
          created_at?: string
          id?: string
          ordem?: number
          subtitulo?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acao?: string | null
          concluido?: boolean
          created_at?: string
          id?: string
          ordem?: number
          subtitulo?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          email: string
          endereco: string | null
          funeraria_id: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email: string
          endereco?: string | null
          funeraria_id?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string
          endereco?: string | null
          funeraria_id?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_documento: {
        Row: {
          descricao: string
          id: string
          nome: string
          obrigatorio: boolean
          ordem: number
        }
        Insert: {
          descricao: string
          id: string
          nome: string
          obrigatorio?: boolean
          ordem?: number
        }
        Update: {
          descricao?: string
          id?: string
          nome?: string
          obrigatorio?: boolean
          ordem?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          funeraria_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          funeraria_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          funeraria_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_funeraria_id_fkey"
            columns: ["funeraria_id"]
            isOneToOne: false
            referencedRelation: "funerarias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_funeraria: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "cliente"
      contratacao_status: "ativo" | "carencia" | "suspenso" | "cancelado"
      doc_status: "pendente" | "analise" | "aprovado" | "rejeitado"
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
      app_role: ["admin", "cliente"],
      contratacao_status: ["ativo", "carencia", "suspenso", "cancelado"],
      doc_status: ["pendente", "analise", "aprovado", "rejeitado"],
    },
  },
} as const
