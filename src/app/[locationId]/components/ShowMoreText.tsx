"use client";

import { useState } from "react";

type ShowMoreTextProps = {
  text: string;
  maxLength?: number; // Default max length before truncating
};

function ShowMoreText({ text, maxLength = 150 }: ShowMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className='text-foreground'>
      <p className='text-sm sm:text-base'>
        {isExpanded
          ? text
          : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
      </p>
      {text.length > maxLength && (
        <button
          onClick={handleToggle}
          className='cursor-pointer text-sm font-semibold hover:underline sm:text-base text-primary'
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

export default ShowMoreText;
