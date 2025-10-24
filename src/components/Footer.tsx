import React from "react";
import { Container } from "@/components/ui/Container";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className='border-border bg-background mt-20 border-t'>
      <Container className='flex flex-col items-center gap-3 py-6 pb-[calc(env(safe-area-inset-bottom)+5rem)] text-center sm:py-8 sm:pb-2'>
        <a
          href='https://www.craveup.com'
          target='_blank'
          rel='noreferrer'
          aria-label='Visit craveup.com'
          className='text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex flex-col items-center gap-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none'
        >
          <Logo width='32' height='32' />
          <span className='flex items-center gap-1'>
            <span>Powered by</span>
            <span className='text-foreground font-semibold underline'>
              Crave Up Inc.
            </span>
          </span>
        </a>
      </Container>
    </footer>
  );
};

export default Footer;
