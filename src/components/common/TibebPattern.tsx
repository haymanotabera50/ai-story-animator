'use client';

import React from 'react';

export const TibebPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden ${className}`}>
      <div className="flex h-full w-full">
        {/* Ethiopian traditional Tibeb stripe harmonized with light pink, purple, and gold */}
        <div className="h-full w-full bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 opacity-90" />
      </div>
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #000 0, #000 3px, transparent 3px, transparent 6px), repeating-linear-gradient(-45deg, #000 0, #000 3px, transparent 3px, transparent 6px)',
        }}
      />
    </div>
  );
};
