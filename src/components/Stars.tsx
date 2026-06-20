"use client";
import React from "react";

export default function Stars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: (i % 3) + 2,
    delay: `${(i * 0.7) % 4}s`,
    duration: `${2 + (i % 3)}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-purple-300"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}
