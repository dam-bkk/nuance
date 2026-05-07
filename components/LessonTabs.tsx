"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { VocabItem } from "@/lib/types";
import Apercu from "./exercises/Apercu";
import Flashcards from "./exercises/Flashcards";
import QCM from "./exercises/QCM";
import GlisserDeposer from "./exercises/GlisserDeposer";
import TexteATrous from "./exercises/TexteATrous";

export default function LessonTabs({
  items,
  allItems,
}: {
  items: VocabItem[];
  allItems: VocabItem[];
}) {
  return (
    <Tabs defaultValue="apercu" className="w-full">
      <div className="sticky top-0 z-10 bg-cream border-b border-[#E0D8CF]">
        <div className="max-w-4xl mx-auto px-6">
          <TabsList className="bg-transparent h-auto gap-0 rounded-none w-full justify-start border-0 p-0">
            {[
              { value: "apercu", label: "Aperçu" },
              { value: "flashcards", label: "Flashcards" },
              { value: "qcm", label: "QCM" },
              { value: "glisser", label: "Glisser-déposer" },
              { value: "trous", label: "Texte à trous" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-burgundy data-[state=active]:text-burgundy data-[state=active]:bg-transparent bg-transparent text-[#6B7A99] hover:text-navy px-4 py-3 text-sm font-medium transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <TabsContent value="apercu" className="mt-0">
          <Apercu items={items} />
        </TabsContent>
        <TabsContent value="flashcards" className="mt-0">
          <Flashcards items={items} />
        </TabsContent>
        <TabsContent value="qcm" className="mt-0">
          <QCM items={items} allItems={allItems} />
        </TabsContent>
        <TabsContent value="glisser" className="mt-0">
          <GlisserDeposer items={items} />
        </TabsContent>
        <TabsContent value="trous" className="mt-0">
          <TexteATrous items={items} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
