"use client";
import { useEffect, useState } from "react";
import type { PhrasesType, PhrasesProps } from "../types";

export const Phrases: React.FC<PhrasesProps> = ({ pharses }) => {
  const [randomPhrases, setRandomPhrases] = useState<PhrasesType[]>([]);

  useEffect(() => {
    const getRandomPhrases = (arr: PhrasesType[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    setRandomPhrases(getRandomPhrases(pharses, 5));
  }, []);

  return (
    <div className="bg-green-100 p-4 rounded shadow ">
      <h2 className="text-xl font-bold mb-4  border-b">Frases</h2>
      <ul>
        {randomPhrases.map((pharse, index) => (
          <li
            key={index}
            className="border-b border-gray-200 pb-2 last:border-b-0 flex justify-between"
          >
            <h3 className="font-normal text-md">{pharse.titulo}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};
