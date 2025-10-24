import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Custom500() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background text-foreground'>
      <h1 className='mb-4 text-7xl font-extrabold text-destructive'>500</h1>
      <h2 className='mb-2 text-3xl font-semibold'>
        Oops! Something went wrong.
      </h2>
      <p className='mb-6 text-center text-muted-foreground'>
        We&apos;re sorry, but something went wrong on our end. Please try again
        later or return to the homepage.
      </p>
      <Button asChild>
        <Link href='/'>Go Back Home</Link>
      </Button>
      <div className='absolute bottom-10 text-muted-foreground'>
        <p>&copy; {new Date().getFullYear()} Crave. All rights reserved.</p>
      </div>
    </div>
  );
}
