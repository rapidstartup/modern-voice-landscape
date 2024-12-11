import React, { useState, useEffect } from 'react';

const words = [
  "AI Phone Assistants",
  "Virtual Employees",
  "Ticket Concierge",
  "Workflow Agents"
];

export const MovableHeadline = () => {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6">
      Deploy Enterprise{" "}
      <span className="text-primary inline-block animate-text-morph">
        {words[currentWord]}
      </span>
    </h1>
  );
};