'use client';

import React from 'react';

interface EthiopianCrossProps {
  className?: string;
  size?: number;
}

export const EthiopianCross: React.FC<EthiopianCrossProps> = ({
  className = 'text-amber-400',
  size = 24,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Finial */}
      <path d="M30 4h4v6h-4z" />
      <circle cx="32" cy="3" r="2" />

      {/* Center Body */}
      <path d="M29 10h6v12h12v6h-12v18h-6V28H17v-6h12V10z" />

      {/* Upper Cross arms accents */}
      <path d="M26 12h12v4H26z" />
      <path d="M12 25h6v12h-6z" />
      <path d="M46 25h6v12h-6z" />

      {/* Traditional perforations */}
      <rect x="30.5" y="14" width="3" height="3" fill="#09090b" />
      <rect x="20" y="27" width="3" height="3" fill="#09090b" />
      <rect x="41" y="27" width="3" height="3" fill="#09090b" />
      <rect x="30.5" y="36" width="3" height="3" fill="#09090b" />
      <circle cx="32" cy="25" r="2" fill="#09090b" />

      {/* Lower base handle / finials */}
      <path d="M27 46h10v3h-10z" />
      <path d="M25 49h14v3H25z" />
      <path d="M28 52h8v8h-8z" />
      <path d="M24 60h16v2H24z" />
    </svg>
  );
};
