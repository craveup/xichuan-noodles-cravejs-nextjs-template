"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      className="
        relative min-h-[100svh] w-full
        flex items-center justify-center
        bg-background text-foreground
        px-4 py-16 sm:py-24
      "
    >

      <div className="w-full max-w-2xl text-center">
        <p className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-primary bg-primary/10 ring-1 ring-inset ring-ring/20">
          404
        </p>

        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-7 text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-8 sm:mt-10 flex justify-center">
          <Button onClick={() => router.push("/")} className="w-[92%] sm:w-auto h-12 rounded-full shadow-md px-6">
            Go back home
          </Button>
        </div>
      </div>
    </main>
  );
}
