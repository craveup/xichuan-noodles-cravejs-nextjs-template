"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

interface ClientIconProps {
  name: keyof typeof LucideIcons;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function ClientIcon({ name, ...props }: ClientIconProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a simple div with the same dimensions during SSR
    return (
      <div 
        className={`inline-block ${props.className || ''}`}
        style={{ 
          width: props.size || 24, 
          height: props.size || 24 
        }}
      />
    );
  }

  const Icon = LucideIcons[name] as React.ComponentType<Omit<ClientIconProps, 'name'>>;
  
  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
}