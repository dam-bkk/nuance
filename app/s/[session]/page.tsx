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
    <div className="min-h-screen bg-pg">
      {/* Header with 3px gradient top bar + logo linking home */}
      <header className="bg-white shadow-[0_1px_0_#E0E4F5]">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-5">
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.svg" alt="LexiC1" className="h-10 w-auto" />
          </Link>

          <div className="h-6 w-px bg-edge" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-cobalt uppercase tracking-widest">
                Session {lesson.session}
              </span>
              <span className="text-edge select-none">·</span>
              <span className="text-xs text-dim">{formatDate(lesson.date)}</span>
              <span className="text-edge select-none">·</span>
              <span className="text-xs font-medium text-dim">{lesson.items.length} mots</span>
            </div>
            <h1 className="text-ink font-bold text-sm mt-0.5 leading-tight truncate">{lesson.theme}</h1>
          </div>
        </div>
      </header>

      <LessonTabs items={lesson.items} allItems={allItems} />
    </div>
  );
}
