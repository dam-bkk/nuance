import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Level } from './types';

const EXAMENS_DIR = path.join(process.cwd(), 'content', 'examens');

export type QuestionType = 'qcm' | 'vrai_faux_non_dit';

export interface ExamenQuestion {
  type: QuestionType;
  q: string;
  a?: [string, string, string];
  c?: number;
  vfnd?: 'vrai' | 'faux' | 'non_dit';
}

export interface ExamenTexte {
  titre: string;
  source?: string;
  texte: string;
  questions: ExamenQuestion[];
}

export interface Examen {
  id: string;
  titre: string;
  type: 'CE' | 'CO';
  niveau: Level;
  description?: string;
  textes: ExamenTexte[];
  total: number;
}

export function getAllExamens(): Examen[] {
  if (!fs.existsSync(EXAMENS_DIR)) return [];
  return fs
    .readdirSync(EXAMENS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const id = file.replace('.md', '');
      const raw = fs.readFileSync(path.join(EXAMENS_DIR, file), 'utf-8');
      const { data } = matter(raw);
      const textes = (data.textes as ExamenTexte[]) || [];
      return {
        id,
        titre: String(data.titre || id),
        type: (String(data.type || 'CE')) as 'CE' | 'CO',
        niveau: (String(data.niveau || 'C1')) as Level,
        description: data.description ? String(data.description) : undefined,
        textes,
        total: textes.reduce((s, t) => s + t.questions.length, 0),
      };
    })
    .sort((a, b) => a.titre.localeCompare(b.titre));
}

export function getExamen(id: string): Examen | null {
  return getAllExamens().find((e) => e.id === id) ?? null;
}
