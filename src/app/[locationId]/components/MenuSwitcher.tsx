"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, Clock } from "lucide-react";
import type { BundleMenu } from "@/types/menus";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface MenuSwitcherProps {
  menus: BundleMenu[];
  selectedIndex: number;
  setSelectedMenuIndex: (nextIndex: number) => void;
}

export default function MenuSwitcher({ menus, selectedIndex, setSelectedMenuIndex }: MenuSwitcherProps) {
  const [open, setOpen] = useState(false);

  const safeIndex = selectedIndex >= 0 && selectedIndex < menus.length ? selectedIndex : 0;
  const selectedMenu = menus[safeIndex];

  const menuCount = menus.length;
  const selectedTimeWindow = selectedMenu?.isActive
    ? (selectedMenu?.time || "Hours unavailable")
    : "Currently unavailable";

  const handleSelect = (entryIndex: number) => {
    setSelectedMenuIndex(entryIndex);
    setOpen(false);
  };

  return (
    <div className="w-full max-w-lg space-y-2">
      <Label className="text-sm text-muted-foreground">Menus ({menuCount})</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-auto w-full justify-between rounded-xl border-border bg-card p-4 text-left shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative hidden h-12 w-12 overflow-hidden rounded-md bg-muted sm:flex">
                <ImageWithFallback
                  src={selectedMenu?.imageUrl}
                  alt={selectedMenu?.name ?? "Menu image"}
                  fill
                  className="object-cover"
                  sizes="48px"
                  fallbackClassName="flex h-full w-full items-center justify-center"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {selectedMenu?.name ?? "Select a menu"}
                </p>
                <p
                  className={`flex items-center gap-1 text-xs ${
                    selectedMenu?.isActive ? "text-muted-foreground" : "text-destructive"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  <span className="truncate">{selectedTimeWindow}</span>
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-[320px] max-w-[90vw] overflow-hidden rounded-xl border-border p-0"
        >
          <Command>
            <CommandList className="max-h-[70vh]">
              <CommandEmpty>No menus available.</CommandEmpty>
              <CommandGroup heading="Available menus">
                {menus.map((menu, index) => {
                  const {name, imageUrl, description, isActive} = menu;
                  const timeWindow = menu.time || "Hours unavailable";
                  const isSelected = index === safeIndex;

                  return (
                    <CommandItem
                      key={menu.id}
                      value={name}
                      onSelect={() => handleSelect(index)}
                      className={`flex items-start gap-3 ${isActive ? "" : "opacity-60"}`}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        <ImageWithFallback
                          src={imageUrl}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="56px"
                          fallbackClassName="flex h-full w-full items-center justify-center"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium">{name}</p>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>

                        <p
                          className={`flex items-center gap-1 text-xs ${
                            isActive ? "text-muted-foreground" : "text-destructive"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span className="truncate">
                            {isActive ? timeWindow : "Unavailable right now"}
                          </span>
                        </p>

                        {description && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
