import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Level } from './types';

const GRAMMAIRE_DIR = path.join(process.cwd(), 'content', 'grammaire');

export interface GrammaireQuestion {
  q: string;
  a: [string, string, string];
  c: number; // correct index 0-2
}

export interface GrammaireTexte {
  texte: string;
  questions: GrammaireQuestion[];
}

export interface GrammaireExo {
  id: string;
  titre: string;
  niveau: Level;
  categorie: string;
  textes: GrammaireTexte[];
  total: number;
}

export function getAllGrammaire(): GrammaireExo[] {
  if (!fs.existsSync(GRAMMAIRE_DIR)) return [];
  return fs
    .readdirSync(GRAMMAIRE_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const id = file.replace('.md', '');
      const raw = fs.readFileSync(path.join(GRAMMAIRE_DIR, file), 'utf-8');
      const { data } = matter(raw);
      const textes = (data.textes as GrammaireTexte[]) || [];
      return {
        id,
        titre: String(data.titre || id),
        niveau: (String(data.niveau || 'C1')) as Level,
        categorie: String(data.categorie || 'Général'),
        textes,
        total: textes.reduce((s, t) => s + t.questions.length, 0),
      };
    })
    .sort((a, b) => a.titre.localeCompare(b.titre));
}

export function getGrammaire(id: string): GrammaireExo | null {
  return getAllGrammaire().find((g) => g.id === id) ?? null;
}
