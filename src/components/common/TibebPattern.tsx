'use client';

import React from 'react';

export const TibebPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden ${className}`}>
      <div className="flex h-full w-full">
        {/* Repeating Ethiopian traditional Tibeb stripe (Green, Gold, Red, Black geometric motifs) */}
        <div className="h-full w-full bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 opacity-80" />
      </div>
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0, #000 3px, transparent 3px, transparent 6px), repeating-linear-gradient(-45deg, #000 0, #000 3px, transparent 3px, transparent 6px)',
        }}
      />
    </div>
  );
};
