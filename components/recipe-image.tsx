"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "onError"> & {
  fallbackClass?: string;
};

export function RecipeImage({ fallbackClass, alt, ...props }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--chip)] text-[var(--muted)] ${fallbackClass ?? ""}`}
        role="img"
        aria-label={alt}
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
