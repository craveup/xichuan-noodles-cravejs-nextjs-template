"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollSyncOptions {
  count: number;
  offset: number;
  dependencyKey?: string | number;
}

interface UseScrollSyncResult {
  activeIndex: number;
  registerSection: (index: number) => (element: HTMLElement | null) => void;
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  reset: (nextIndex?: number) => void;
}

const SCROLL_RELEASE_DELAY = 160;

export function useScrollSync({
  count,
  offset,
  dependencyKey,
}: UseScrollSyncOptions): UseScrollSyncResult {
  const [activeIndex, setActiveIndexState] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const cleanupScrollListenerRef = useRef<(() => void) | null>(null);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  const updateActiveIndex = useCallback((nextIndex: number) => {
    activeIndexRef.current = nextIndex;
    setActiveIndexState(nextIndex);
  }, []);

  const registerSection = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      sectionRefs.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    sectionRefs.current.length = count;
    if (count === 0) {
      updateActiveIndex(0);
    } else if (activeIndexRef.current >= count) {
      updateActiveIndex(count - 1);
    }
  }, [count, updateActiveIndex]);

  useEffect(() => {
    return () => {
      cleanupScrollListenerRef.current?.();
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!count) return;

    const sections: HTMLElement[] = [];
    const indexMap = new Map<HTMLElement, number>();

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      sections.push(section);
      indexMap.set(section, index);
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const firstVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aIndex = indexMap.get(a.target as HTMLElement) ?? 0;
            const bIndex = indexMap.get(b.target as HTMLElement) ?? 0;
            return aIndex - bIndex;
          })[0];

        if (!firstVisible) return;

        const nextIndex = indexMap.get(firstVisible.target as HTMLElement);
        if (typeof nextIndex === "number" && nextIndex !== activeIndexRef.current) {
          updateActiveIndex(nextIndex);
        }
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0.1, 0.3, 0.6, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [count, offset, dependencyKey, updateActiveIndex]);

  const reset = useCallback(
    (nextIndex: number = 0) => {
      cleanupScrollListenerRef.current?.();
      cleanupScrollListenerRef.current = null;

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = undefined;
      }

      isProgrammaticScrollRef.current = false;

      const clampedIndex = Math.max(0, Math.min(nextIndex, Math.max(count - 1, 0)));
      updateActiveIndex(clampedIndex);
    },
    [count, updateActiveIndex],
  );

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const section = sectionRefs.current[index];
      if (!section) return;

      cleanupScrollListenerRef.current?.();
      cleanupScrollListenerRef.current = null;

      const targetY = section.getBoundingClientRect().top + window.scrollY - offset;

      isProgrammaticScrollRef.current = true;
      updateActiveIndex(index);

      const clearProgrammaticState = () => {
        isProgrammaticScrollRef.current = false;
        cleanupScrollListenerRef.current?.();
        cleanupScrollListenerRef.current = null;
      };

      const handleScroll = () => {
        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(clearProgrammaticState, SCROLL_RELEASE_DELAY);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      cleanupScrollListenerRef.current = () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = undefined;
        }
      };

      window.scrollTo({ top: targetY, behavior });
    },
    [offset, updateActiveIndex],
  );

  return {
    activeIndex,
    registerSection,
    scrollToIndex,
    reset,
  };
}

export default useScrollSync;
