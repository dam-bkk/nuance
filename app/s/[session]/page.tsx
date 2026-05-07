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
      <header className="border-b border-[#E0D8CF] bg-cream">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-[#6B7A99] hover:text-burgundy transition-colors text-sm">
            ← Retour
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-[#6B7A99]">
                Session {lesson.session}
              </span>
              <span className="text-[#E0D8CF]">·</span>
              <span className="text-xs text-[#6B7A99]">{formatDate(lesson.date)}</span>
              <span className="text-[#E0D8CF]">·</span>
              <span className="text-xs text-[#6B7A99]">{lesson.items.length} mots</span>
            </div>
            <h1 className="font-serif text-xl text-navy mt-0.5">{lesson.theme}</h1>
          </div>
        </div>
      </header>

      <LessonTabs items={lesson.items} allItems={allItems} />
    </div>
  );
}
