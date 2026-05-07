import { notFound } from "next/navigation";
import Link from "next/link";
import { getLesson, getAllItems } from "@/lib/parse-lesson";
import LessonTabs from "@/components/LessonTabs";

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function SessionPage({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  const sessionNum = parseInt(session, 10);
  if (isNaN(sessionNum)) notFound();

  const lesson = getLesson(sessionNum);
  if (!lesson) notFound();

  const allItems = getAllItems();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-rim">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-5">
          <Link href="/">
            <img src="/logo.svg" alt="LexiC1" className="h-10 w-auto" />
          </Link>
          <div className="h-6 w-px bg-rim" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-cobalt uppercase tracking-widest">
                Session {lesson.session}
              </span>
              <span className="text-rim">·</span>
              <span className="text-xs text-dim">{formatDate(lesson.date)}</span>
              <span className="text-rim">·</span>
              <span className="text-xs text-dim">{lesson.items.length} mots</span>
            </div>
            <h1 className="text-ink font-semibold text-base mt-0.5 leading-tight">{lesson.theme}</h1>
          </div>
        </div>
      </header>

      <LessonTabs items={lesson.items} allItems={allItems} />
    </div>
  );
}
