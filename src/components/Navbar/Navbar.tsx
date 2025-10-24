"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../Logo";
import UserAuth from "./UserAuthNavbar";
import ThemeToggle from "@/components/ThemeToggle";
import CartNavButton from "@/components/cart/CartNavButton";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";

type NavbarProps = {
  backHref?: string;
  centerText?: string;
};

const Navbar = ({ backHref, centerText }: NavbarProps) => {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          {backHref ? (
            <Button asChild variant="ghost" size="icon" aria-label="Go back">
              <Link href={backHref}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          ) : null}

          <Link href="/" aria-label="Go to storefront home" className="inline-flex items-center">
            <Logo />
          </Link>
        </div>

        {centerText ? (
          <p className="hidden flex-1 text-center text-sm text-muted-foreground sm:block">
            {centerText}
          </p>
        ) : (
          <span className="flex-1" aria-hidden />
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          <CartNavButton />
          <ThemeToggle />
          <UserAuth />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
