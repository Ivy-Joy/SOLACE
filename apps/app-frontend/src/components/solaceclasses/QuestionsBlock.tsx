// Discussion prompts
// apps/app-frontend/src/components/solaceSunday/QuestionsBlock.tsx
"use client";
import React from "react";

export default function QuestionsBlock({ questions }: { questions: string[] }) {
  return (
    <div className="mt-3">
      <h5 className="text-sm font-black uppercase text-gray-500 mb-2">Discussion Questions</h5>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  );
}