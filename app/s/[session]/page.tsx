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
      {/* Nav */}
      <header className="bg-white border-b border-edge">
        <div className="h-[3px] bg-gradient-to-r from-[#0028FF] to-[#FF0000]" />
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/icon.svg" alt="" className="h-9 w-9 rounded-xl" />
            <span className="text-base font-black text-ink tracking-tight">LexiC1</span>
          </Link>
          <div className="h-5 w-px bg-edge" />
          <span className="text-xs font-extrabold text-cobalt uppercase tracking-widest">Session {lesson.session}</span>
        </div>
      </header>

      {/* Hero card */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-cobalt rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 left-14 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-24 w-14 h-14 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest mb-2">
              Session {lesson.session} · {formatDate(lesson.date)}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5">
              {lesson.theme}
            </h1>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">{lesson.items.length}</div>
                <div className="text-white/60 text-xs font-bold mt-1">mots</div>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-2">
                <div className="text-white font-black text-lg leading-none">5</div>
                <div className="text-white/60 text-xs font-bold mt-1">exercices</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LessonTabs items={lesson.items} allItems={allItems} />
    </div>
  );
}
