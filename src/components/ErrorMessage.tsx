import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorProps {
  message: string;
  className?: string;
  onClick?: () => void;
}

const ErrorMessage: React.FC<ErrorProps> = ({
  message,
  className = "",
  onClick,
}) => {
  return (
    <div className="text-center">
      <Alert variant="destructive" className={className}>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {onClick && (
        <Button onClick={onClick} className="mt-2 text-base">
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
