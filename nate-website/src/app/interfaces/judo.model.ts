export type BeltLevel = 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'brown' | 'black';
export type MainCategory = 'tachi-waza' | 'ne-waza' | 'kiso' | 'kata' | 'knowledge';

export interface JudoTechnique {
  title_en: string;
  title_romaji: string;
  title_kanji: string;
  belt_requirement?: BeltLevel;
  category: MainCategory;
  sub_category: string;
  youtube_id?: string;
  official_url?: string;
  is_kata: boolean;
  is_theory: boolean;
  description?: string;
  key_points?: string[];
  kata_forms?: string[];
}
