import { notFound } from "next/navigation";
import { getLesson, getAllItems } from "@/lib/parse-lesson";
import LessonTabs from "@/components/LessonTabs";
import AppHeader from "@/components/AppHeader";

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
      <AppHeader back={{ href: "/", label: "Accueil" }} section="Vocabulaire" item={`Session ${lesson.session}`} />

      {/* Hero card */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-cobalt rounded-4xl p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 left-14 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute top-4 right-24 w-14 h-14 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/60 text-xs font-extrabold uppercase tracking-widest">
                Session {lesson.session} · {formatDate(lesson.date)}
              </p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                lesson.level === "B2" ? "bg-emerald-400/30 text-emerald-200" : "bg-white/20 text-white/80"
              }`}>
                {lesson.level}
              </span>
            </div>
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

      <LessonTabs items={lesson.items} allItems={allItems} sessionNum={sessionNum} />
    </div>
  );
}
