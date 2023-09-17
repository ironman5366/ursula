export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      authors: {
        Row: {
          created_at: string | null;
          id: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      books: {
        Row: {
          author_id: number;
          created_at: string | null;
          google_id: string;
          id: number;
          isbn: string;
          large_thumbnail_url: string;
          small_thumbnail_url: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: number;
          created_at?: string | null;
          google_id: string;
          id?: number;
          isbn: string;
          large_thumbnail_url: string;
          small_thumbnail_url: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: number;
          created_at?: string | null;
          google_id?: string;
          id?: number;
          isbn?: string;
          large_thumbnail_url?: string;
          small_thumbnail_url?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_author_id";
            columns: ["author_id"];
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      reading_lists: {
        Row: {
          book_id: number;
          created_at: string | null;
          id: number;
          updated_at: string | null;
          user_uid: string;
        };
        Insert: {
          book_id: number;
          created_at?: string | null;
          id?: number;
          updated_at?: string | null;
          user_uid: string;
        };
        Update: {
          book_id?: number;
          created_at?: string | null;
          id?: number;
          updated_at?: string | null;
          user_uid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_book_id";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_user_uid";
            columns: ["user_uid"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          book_id: number;
          created_at: string | null;
          id: number;
          prev_review_id: number | null;
          updated_at: string | null;
          user_uid: string;
        };
        Insert: {
          book_id: number;
          created_at?: string | null;
          id?: number;
          prev_review_id?: number | null;
          updated_at?: string | null;
          user_uid: string;
        };
        Update: {
          book_id?: number;
          created_at?: string | null;
          id?: number;
          prev_review_id?: number | null;
          updated_at?: string | null;
          user_uid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_book_id";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_prev_review_id";
            columns: ["prev_review_id"];
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_user_uid";
            columns: ["user_uid"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      search_cache: {
        Row: {
          created_at: string | null;
          id: number;
          query: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          query: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          query?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      search_cache_books: {
        Row: {
          book_id: number;
          cache_id: number;
          created_at: string | null;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          book_id: number;
          cache_id: number;
          created_at?: string | null;
          id?: number;
          updated_at?: string | null;
        };
        Update: {
          book_id?: number;
          cache_id?: number;
          created_at?: string | null;
          id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_book_id";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_cache_id";
            columns: ["cache_id"];
            referencedRelation: "search_cache";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "objects_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
