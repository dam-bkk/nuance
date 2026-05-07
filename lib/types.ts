export type Registre = 'familier' | 'courant' | 'soutenu' | 'littéraire';

export type VocabItem = {
  word: string;
  nature: string;
  registre: Registre;
  definition: string;
  traduction: string;
  exemples: string[];
  synonymes: string[];
  antonymes: string[];
  collocations: string[];
  piege: string | null;
};

export type Lesson = {
  session: number;
  date: string;
  theme: string;
  items: VocabItem[];
};
