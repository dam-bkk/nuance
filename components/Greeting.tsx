"use client";

import { useState, useEffect } from "react";

export default function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h >= 5 && h < 18 ? "Bonjour" : "Bonsoir");
  }, []);

  if (!greeting) return null;

  return (
    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
      {greeting}<br />{name}.
    </h1>
  );
}
