import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Lesson, VocabItem, Registre, Level } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function parseListField(lines: string[], key: string): string[] {
  const prefix = `- **${key}**:`;
  const line = lines.find((l) => l.trimStart().startsWith(prefix));
  if (!line) return [];
  const raw = line.slice(line.indexOf(prefix) + prefix.length).trim();
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseStringField(lines: string[], key: string): string {
  const prefix = `- **${key}**:`;
  const line = lines.find((l) => l.trimStart().startsWith(prefix));
  if (!line) return '';
  return line.slice(line.indexOf(prefix) + prefix.length).trim();
}

function parseExemples(lines: string[]): string[] {
  const exemples: string[] = [];
  let inExemples = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('- **exemples**:')) {
      inExemples = true;
      continue;
    }
    if (inExemples) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') && !trimmed.startsWith('- **')) {
        exemples.push(trimmed.slice(2).trim());
      } else if (trimmed.startsWith('- **')) {
        break;
      }
    }
  }
  return exemples;
}

function parseWordSection(header: string, body: string): VocabItem | null {
  const word = header.trim();
  if (!word) return null;

  const lines = body.split('\n');

  const nature = parseStringField(lines, 'nature');
  const registreRaw = parseStringField(lines, 'registre') as Registre;
  const definition = parseStringField(lines, 'définition');
  const traduction = parseStringField(lines, 'traduction');
  const exemples = parseExemples(lines);
  const synonymes = parseListField(lines, 'synonymes');
  const antonymes = parseListField(lines, 'antonymes');
  const collocations = parseListField(lines, 'collocations');
  const piegeRaw = parseStringField(lines, 'piège');

  return {
    word,
    nature,
    registre: registreRaw || 'courant',
    definition,
    traduction,
    exemples,
    synonymes,
    antonymes,
    collocations,
    piege: piegeRaw || null,
  };
}

function parseLessonContent(content: string, data: Record<string, unknown>): Lesson {
  // Split on `## ` to get word sections (first chunk is intro text before any word)
  const sections = content.split(/^## /m);
  const items: VocabItem[] = [];

  for (let i = 1; i < sections.length; i++) {
    const [header, ...rest] = sections[i].split('\n');
    const body = rest.join('\n');
    const item = parseWordSection(header, body);
    if (item) items.push(item);
  }

  return {
    session: Number(data.session),
    date: String(data.date),
    theme: String(data.theme),
    level: (String(data.level || 'C1')) as Level,
    category: String(data.category || 'Général'),
    items,
  };
}

export function getAllLessons(): Lesson[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const lessons = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    return parseLessonContent(content, data);
  });

  return lessons.sort((a, b) => b.session - a.session);
}

export function getLesson(session: number): Lesson | null {
  const lessons = getAllLessons();
  return lessons.find((l) => l.session === session) ?? null;
}

export function getAllItems(): VocabItem[] {
  return getAllLessons().flatMap((l) => l.items);
}
