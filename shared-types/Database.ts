export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
      activities: {
        Row: {
          created_at: string;
          data: Json;
          id: number;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: number;
          type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: number;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_user_activities_user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      authors: {
        Row: {
          alternate_names: string[] | null;
          bio: string | null;
          birth_date: string | null;
          death_date: string | null;
          eastern_order: boolean | null;
          enumeration: string | null;
          id: number;
          location: string | null;
          name: string;
          ol_id: string;
          personal_name: string | null;
          photos: number[] | null;
          title: string | null;
        };
        Insert: {
          alternate_names?: string[] | null;
          bio?: string | null;
          birth_date?: string | null;
          death_date?: string | null;
          eastern_order?: boolean | null;
          enumeration?: string | null;
          id?: number;
          location?: string | null;
          name: string;
          ol_id: string;
          personal_name?: string | null;
          photos?: number[] | null;
          title?: string | null;
        };
        Update: {
          alternate_names?: string[] | null;
          bio?: string | null;
          birth_date?: string | null;
          death_date?: string | null;
          eastern_order?: boolean | null;
          enumeration?: string | null;
          id?: number;
          location?: string | null;
          name?: string;
          ol_id?: string;
          personal_name?: string | null;
          photos?: number[] | null;
          title?: string | null;
        };
        Relationships: [];
      };
      book_authors: {
        Row: {
          as_what: string | null;
          author_id: number | null;
          author_ol_id: string | null;
          book_id: number | null;
          book_ol_id: string | null;
          id: number;
          role: string | null;
        };
        Insert: {
          as_what?: string | null;
          author_id?: number | null;
          author_ol_id?: string | null;
          book_id?: number | null;
          book_ol_id?: string | null;
          id?: number;
          role?: string | null;
        };
        Update: {
          as_what?: string | null;
          author_id?: number | null;
          author_ol_id?: string | null;
          book_id?: number | null;
          book_ol_id?: string | null;
          id?: number;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_authors_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_authors_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          }
        ];
      };
      book_excerpts: {
        Row: {
          book_id: number | null;
          edition_id: number | null;
          excerpt: string;
          id: number;
          is_first_sentence: boolean;
        };
        Insert: {
          book_id?: number | null;
          edition_id?: number | null;
          excerpt: string;
          id?: number;
          is_first_sentence: boolean;
        };
        Update: {
          book_id?: number | null;
          edition_id?: number | null;
          excerpt?: string;
          id?: number;
          is_first_sentence?: boolean;
        };
        Relationships: [];
      };
      book_links: {
        Row: {
          book_id: number | null;
          id: number;
          title: string;
          url: string;
        };
        Insert: {
          book_id?: number | null;
          id?: number;
          title: string;
          url: string;
        };
        Update: {
          book_id?: number | null;
          id?: number;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      book_subjects: {
        Row: {
          book_id: number | null;
          book_ol_id: string | null;
          id: number;
          subject_id: number | null;
          subject_name: string | null;
        };
        Insert: {
          book_id?: number | null;
          book_ol_id?: string | null;
          id?: number;
          subject_id?: number | null;
          subject_name?: string | null;
        };
        Update: {
          book_id?: number | null;
          book_ol_id?: string | null;
          id?: number;
          subject_id?: number | null;
          subject_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "book_subjects_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_subjects_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_subjects_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subjects";
            referencedColumns: ["id"];
          }
        ];
      };
      books: {
        Row: {
          alternate_titles: string[] | null;
          book_key: string | null;
          covers: number[] | null;
          description: string | null;
          dewey_numbers: string[] | null;
          excerpts: string[] | null;
          id: number;
          large_cover_key: string | null;
          last_cover_update: string | null;
          lc_classifications: string[] | null;
          links: Json | null;
          medium_cover_key: string | null;
          ol_id: string;
          popularity: number | null;
          rating_count: number | null;
          reading_count: number | null;
          small_cover_key: string | null;
          subtitle: string | null;
          title: string;
        };
        Insert: {
          alternate_titles?: string[] | null;
          book_key?: string | null;
          covers?: number[] | null;
          description?: string | null;
          dewey_numbers?: string[] | null;
          excerpts?: string[] | null;
          id?: number;
          large_cover_key?: string | null;
          last_cover_update?: string | null;
          lc_classifications?: string[] | null;
          links?: Json | null;
          medium_cover_key?: string | null;
          ol_id: string;
          popularity?: number | null;
          rating_count?: number | null;
          reading_count?: number | null;
          small_cover_key?: string | null;
          subtitle?: string | null;
          title: string;
        };
        Update: {
          alternate_titles?: string[] | null;
          book_key?: string | null;
          covers?: number[] | null;
          description?: string | null;
          dewey_numbers?: string[] | null;
          excerpts?: string[] | null;
          id?: number;
          large_cover_key?: string | null;
          last_cover_update?: string | null;
          lc_classifications?: string[] | null;
          links?: Json | null;
          medium_cover_key?: string | null;
          ol_id?: string;
          popularity?: number | null;
          rating_count?: number | null;
          reading_count?: number | null;
          small_cover_key?: string | null;
          subtitle?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      currently_reading_items: {
        Row: {
          book_id: number;
          created_at: string;
          id: number;
          legacy_book_id: number | null;
          user_id: string;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          user_id: string;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "currently_reading_items_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "currently_reading_items_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "currently_reading_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_currently_reading_items_book_id";
            columns: ["legacy_book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          }
        ];
      };
      edition_genres: {
        Row: {
          edition_id: number | null;
          edition_ol_id: string | null;
          genre_id: number | null;
          genre_name: string | null;
          id: number;
        };
        Insert: {
          edition_id?: number | null;
          edition_ol_id?: string | null;
          genre_id?: number | null;
          genre_name?: string | null;
          id?: number;
        };
        Update: {
          edition_id?: number | null;
          edition_ol_id?: string | null;
          genre_id?: number | null;
          genre_name?: string | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "edition_genres_edition_id_fkey";
            columns: ["edition_id"];
            isOneToOne: false;
            referencedRelation: "editions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "edition_genres_genre_id_fkey";
            columns: ["genre_id"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["id"];
          }
        ];
      };
      editions: {
        Row: {
          alternate_titles: string[] | null;
          book_id: number | null;
          book_ol_id: string | null;
          covers: number[] | null;
          id: number;
          isbn_10: string | null;
          isbn_13: string | null;
          lc_classifications: string[] | null;
          number_of_pages: number | null;
          ol_id: string;
          publish_date: string | null;
          publish_places: string[] | null;
          series: string | null;
          subtitle: string | null;
          title: string;
        };
        Insert: {
          alternate_titles?: string[] | null;
          book_id?: number | null;
          book_ol_id?: string | null;
          covers?: number[] | null;
          id?: number;
          isbn_10?: string | null;
          isbn_13?: string | null;
          lc_classifications?: string[] | null;
          number_of_pages?: number | null;
          ol_id: string;
          publish_date?: string | null;
          publish_places?: string[] | null;
          series?: string | null;
          subtitle?: string | null;
          title: string;
        };
        Update: {
          alternate_titles?: string[] | null;
          book_id?: number | null;
          book_ol_id?: string | null;
          covers?: number[] | null;
          id?: number;
          isbn_10?: string | null;
          isbn_13?: string | null;
          lc_classifications?: string[] | null;
          number_of_pages?: number | null;
          ol_id?: string;
          publish_date?: string | null;
          publish_places?: string[] | null;
          series?: string | null;
          subtitle?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "editions_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "editions_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          }
        ];
      };
      follows: {
        Row: {
          created_at: string;
          followee_id: string;
          follower_id: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          followee_id: string;
          follower_id: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          followee_id?: string;
          follower_id?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_follows_followee_id";
            columns: ["followee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_follows_follower_id";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      genres: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      legacy_authors: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      legacy_book_authors: {
        Row: {
          author_id: number | null;
          book_id: number | null;
          created_at: string;
          id: number;
          updated_at: string;
        };
        Insert: {
          author_id?: number | null;
          book_id?: number | null;
          created_at?: string;
          id?: number;
          updated_at?: string;
        };
        Update: {
          author_id?: number | null;
          book_id?: number | null;
          created_at?: string;
          id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "legacy_authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_authors_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          }
        ];
      };
      legacy_book_mappings: {
        Row: {
          id: number;
          legacy_book_id: number;
          ol_book_id: number;
        };
        Insert: {
          id?: number;
          legacy_book_id: number;
          ol_book_id: number;
        };
        Update: {
          id?: number;
          legacy_book_id?: number;
          ol_book_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "legacy_book_mappings_book_id_fkey";
            columns: ["ol_book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "legacy_book_mappings_book_id_fkey";
            columns: ["ol_book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "legacy_book_mappings_legacy_book_id_fkey";
            columns: ["legacy_book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          }
        ];
      };
      legacy_books: {
        Row: {
          author_key: string | null;
          created_at: string;
          description: string | null;
          id: number;
          large_thumbnail_key: string | null;
          name: string;
          small_thumbnail_key: string | null;
          updated_at: string;
        };
        Insert: {
          author_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          large_thumbnail_key?: string | null;
          name: string;
          small_thumbnail_key?: string | null;
          updated_at?: string;
        };
        Update: {
          author_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          large_thumbnail_key?: string | null;
          name?: string;
          small_thumbnail_key?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      legacy_editions: {
        Row: {
          book_id: number;
          created_at: string;
          description: string | null;
          google_id: string;
          id: number;
          isbn_10: string | null;
          isbn_13: string | null;
          isbn_13_or_10: string | null;
          name: string;
          updated_at: string;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          description?: string | null;
          google_id: string;
          id?: number;
          isbn_10?: string | null;
          isbn_13?: string | null;
          isbn_13_or_10?: string | null;
          name: string;
          updated_at?: string;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          description?: string | null;
          google_id?: string;
          id?: number;
          isbn_10?: string | null;
          isbn_13?: string | null;
          isbn_13_or_10?: string | null;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_id";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          }
        ];
      };
      ol_files_uploaded: {
        Row: {
          file_name: string;
          id: number;
        };
        Insert: {
          file_name: string;
          id?: number;
        };
        Update: {
          file_name?: string;
          id?: number;
        };
        Relationships: [];
      };
      ol_ratings: {
        Row: {
          book_id: number | null;
          date: string | null;
          edition_id: number | null;
          id: number;
          ol_book_id: string;
          ol_edition_id: string | null;
          rating: number;
        };
        Insert: {
          book_id?: number | null;
          date?: string | null;
          edition_id?: number | null;
          id?: number;
          ol_book_id: string;
          ol_edition_id?: string | null;
          rating: number;
        };
        Update: {
          book_id?: number | null;
          date?: string | null;
          edition_id?: number | null;
          id?: number;
          ol_book_id?: string;
          ol_edition_id?: string | null;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ol_ratings_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ol_ratings_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ol_ratings_edition_id_fkey";
            columns: ["edition_id"];
            isOneToOne: false;
            referencedRelation: "editions";
            referencedColumns: ["id"];
          }
        ];
      };
      ol_reading_log_items: {
        Row: {
          book_id: number | null;
          date: string | null;
          edition_id: number | null;
          id: number;
          ol_book_id: string;
          ol_edition_id: string | null;
          status: string;
        };
        Insert: {
          book_id?: number | null;
          date?: string | null;
          edition_id?: number | null;
          id?: number;
          ol_book_id: string;
          ol_edition_id?: string | null;
          status: string;
        };
        Update: {
          book_id?: number | null;
          date?: string | null;
          edition_id?: number | null;
          id?: number;
          ol_book_id?: string;
          ol_edition_id?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ol_reading_log_items_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ol_reading_log_items_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ol_reading_log_items_edition_id_fkey";
            columns: ["edition_id"];
            isOneToOne: false;
            referencedRelation: "editions";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_key: string | null;
          bio: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          review_ids: number[];
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_key?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          review_ids?: number[];
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_key?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          review_ids?: number[];
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      ratings_affected: {
        Row: {
          count: number | null;
        };
        Insert: {
          count?: number | null;
        };
        Update: {
          count?: number | null;
        };
        Relationships: [];
      };
      reading_list_items: {
        Row: {
          book_id: number;
          created_at: string;
          id: number;
          legacy_book_id: number | null;
          list_id: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          list_id?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          list_id?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_id";
            columns: ["legacy_book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_list_items_list_id_fkey";
            columns: ["list_id"];
            isOneToOne: false;
            referencedRelation: "reading_lists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_list_items_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reading_list_items_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reading_lists: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_reading_lists_user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      reading_log_items_affected: {
        Row: {
          count: number | null;
        };
        Insert: {
          count?: number | null;
        };
        Update: {
          count?: number | null;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          book_id: number;
          created_at: string;
          id: number;
          legacy_book_id: number | null;
          recomendee_id: string;
          recomender_id: string;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          recomendee_id: string;
          recomender_id: string;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          recomendee_id?: string;
          recomender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_recommendations_book_id";
            columns: ["legacy_book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_recommendations_recomendee_id";
            columns: ["recomendee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_recommendations_recomender_id";
            columns: ["recomender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recommendations_ol_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          book_id: number;
          created_at: string;
          id: number;
          legacy_book_id: number | null;
          note: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          note?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          id?: number;
          legacy_book_id?: number | null;
          note?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "book_id";
            columns: ["legacy_book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "book_popularity";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_id";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      search_cache_entries: {
        Row: {
          book_id: number | null;
          created_at: string | null;
          id: number;
          query_id: number | null;
        };
        Insert: {
          book_id?: number | null;
          created_at?: string | null;
          id?: number;
          query_id?: number | null;
        };
        Update: {
          book_id?: number | null;
          created_at?: string | null;
          id?: number;
          query_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "search_cache_entries_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "legacy_books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "search_cache_entries_query_id_fkey";
            columns: ["query_id"];
            isOneToOne: false;
            referencedRelation: "search_cache_queries";
            referencedColumns: ["id"];
          }
        ];
      };
      search_cache_queries: {
        Row: {
          created_at: string | null;
          id: number;
          query: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          query: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          query?: string;
        };
        Relationships: [];
      };
      subjects: {
        Row: {
          id: number;
          name: string;
          subject_type: string;
        };
        Insert: {
          id?: number;
          name: string;
          subject_type: string;
        };
        Update: {
          id?: number;
          name?: string;
          subject_type?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          review_ids: number[];
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          review_ids?: number[];
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          review_ids?: number[];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      book_popularity: {
        Row: {
          id: number | null;
          popularity: number | null;
          rating_count: number | null;
          reading_count: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      delete_bs_author: {
        Args: {
          delete_ol_id: string;
        };
        Returns: undefined;
      };
      delete_only_bs_author: {
        Args: {
          delete_ol_id: string;
        };
        Returns: undefined;
      };
      delete_orphan_books: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_book_genres: {
        Args: {
          q_book_id: number;
        };
        Returns: {
          id: number;
          name: string;
        }[];
      };
      search_all: {
        Args: {
          search_text: string;
        };
        Returns: {
          entity_id_numeric: number;
          entity_id_uuid: string;
          entity_type: string;
          result_field: string;
          search_field: string;
          order_key: number;
        }[];
      };
      search_book_titles: {
        Args: {
          search_text: string;
        };
        Returns: {
          alternate_titles: string[] | null;
          book_key: string | null;
          covers: number[] | null;
          description: string | null;
          dewey_numbers: string[] | null;
          excerpts: string[] | null;
          id: number;
          large_cover_key: string | null;
          last_cover_update: string | null;
          lc_classifications: string[] | null;
          links: Json | null;
          medium_cover_key: string | null;
          ol_id: string;
          popularity: number | null;
          rating_count: number | null;
          reading_count: number | null;
          small_cover_key: string | null;
          subtitle: string | null;
          title: string;
        }[];
      };
      search_only_books: {
        Args: {
          search_text: string;
        };
        Returns: {
          alternate_titles: string[] | null;
          book_key: string | null;
          covers: number[] | null;
          description: string | null;
          dewey_numbers: string[] | null;
          excerpts: string[] | null;
          id: number;
          large_cover_key: string | null;
          last_cover_update: string | null;
          lc_classifications: string[] | null;
          links: Json | null;
          medium_cover_key: string | null;
          ol_id: string;
          popularity: number | null;
          rating_count: number | null;
          reading_count: number | null;
          small_cover_key: string | null;
          subtitle: string | null;
          title: string;
        }[];
      };
      social_feed: {
        Args: {
          for_user_id: string;
        };
        Returns: {
          created_at: string;
          data: Json;
          id: number;
          type: string;
          user_id: string;
        }[];
      };
      update_book_counts: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
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
          owner_id: string | null;
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
          owner_id?: string | null;
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
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
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
          owner_id: string | null;
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
          owner_id?: string | null;
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
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
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
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
