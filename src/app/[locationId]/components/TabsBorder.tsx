import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BundleCategory } from "@/types/menus";

interface TabsBorderProps {
  categories: BundleCategory[];
  activeIndex: number;
  onTabClick: (index: number) => void;
}
const TabsBorder = ({
  categories,
  activeIndex,
  onTabClick,
}: TabsBorderProps) => {
  return (
    <Tabs value={String(activeIndex)} className='w-full'>
      <TabsList className='bg-background flex h-12 justify-start gap-6 rounded-none border-b p-0'>
        {categories.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <TabsTrigger
              key={tab.id ?? index}
              value={String(index)}
              onClick={(e) => {
                e.preventDefault();
                onTabClick(index);
              }}
              className={cn(
                "relative h-full rounded-none !bg-transparent px-0 py-3 text-sm font-medium !shadow-none transition",
              )}
            >
              <span className='text-sm font-semibold sm:text-base'>
                {tab.name.toUpperCase()}
              </span>
              <span
                className={cn(
                  "bg-primary absolute -bottom-[1px] left-0 h-[2px] w-full scale-x-0 transition-transform duration-300",
                  isActive && "scale-x-100",
                )}
              />
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
export default TabsBorder;
