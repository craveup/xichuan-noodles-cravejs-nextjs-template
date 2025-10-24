import React from 'react';

interface NoMenuProps {
  message?: string;
}

const NoMenu: React.FC<NoMenuProps> = ({ message = "No Menu Available" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-muted">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-muted-foreground mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.172 9.172a4 4 0 105.656 5.656 4 4 0 00-5.656-5.656z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15h.01" />
      </svg>
      <p className="text-foreground text-xl font-semibold">{message}</p>
      <p className="text-muted-foreground mt-2 text-center">
        We’re sorry, but there are no items available at the moment.
      </p>
    </div>
  );
};

export default NoMenu;
