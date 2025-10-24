import { useEffect, useState } from "react";

const DEFAULT_TABS_HEIGHT = 48;

export function useTabsHeight(
  ref: React.RefObject<HTMLDivElement | null>,
  dependency: unknown,
  defaultHeight: number = DEFAULT_TABS_HEIGHT,
) {
  const [tabsHeight, setTabsHeight] = useState(defaultHeight);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateHeight = () => {
      setTabsHeight(element.offsetHeight || defaultHeight);
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, dependency, defaultHeight]);

  return tabsHeight;
}

export default useTabsHeight;
