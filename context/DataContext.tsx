"use client";

import { QuestionType } from "@/types";
import React, { createContext, useEffect, useState, ReactNode } from "react";

export interface DataContextType {
  user: string;
  prompt: string;
  getPrompt: (input?: string) => Promise<string | null>;
  getNote: () => Promise<void>;
  saveNote: (note: string) => void;
  note: string;
  setNote: (note: string) => void;
  question: QuestionType | null;
  answer: string;
  generateQuestion: (input: string) => Promise<void>;
  submitAnswer: (input: string) => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {

  const [prompt, setPrompt] = useState("");
  const [user] = useState("Gonza");
  const [note, setNote] = useState<string>("");
  const [question, setQuestion] = useState<{ question: string } | null>(null);
  const [answer, setAnswer] = useState("");

  const getPrompt = async (input?: string): Promise<string | null> => {
    if (!input) return null;
    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const result = await response.json();
      if (result.data) {
        setPrompt(result.data);
        return result.data;
      } else {
        console.error("No se recibió data del endpoint", result);
        return null;
      }
    } catch (error) {
      console.error("Error al generar prompt:", error);
      return null;
    }
  };

  const getNote = async () => {
    try {
      const res = await fetch("/api/note");
      const data = await res.json();
      setNote(data.content || "");
    } catch (err) {
      console.error("Error fetching note:", err);
    }
  };

  let saveTimeout: NodeJS.Timeout;

  const saveNote = (content: string) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      try {
        await fetch("/api/note", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch (err) {
        console.error("Error saving note:", err);
      }
    }, 1000);
  };

  const generateQuestion = async () => {
        try {
            setAnswer(""); 
            const res = await fetch("/api/quiz");
            const data = await res.json();
            setQuestion(data.question);
        } catch (err) {
            console.error("Error al generar pregunta:", err);
        }
    };

    const submitAnswer = async (userAnswer: string) => {
        if (!question) return;
        try {         
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question.question, answer: userAnswer }),
            });

            const data = await res.json();
            setAnswer(data.feedback);
        } catch (err) {
            console.error("Error al enviar respuesta:", err);
            setAnswer("Ocurrió un error al enviar la respuesta.");
        } 
    };

  useEffect(() => {
    getNote();
  }, []);

  return (
    <DataContext.Provider
      value={{
        prompt,
        getPrompt,
        user,
        note,
        setNote,
        saveNote,
        getNote,
        generateQuestion,
        submitAnswer,
        answer,
        question
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
