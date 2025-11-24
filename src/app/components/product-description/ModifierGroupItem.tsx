"use client";

import React from "react";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type {
  Modifier,
  ModifierChildLink,
  ModifierItem,
  SelectedModifierOption,
  SelectedModifierTypes,
} from "@/lib/api/types";
import ItemCounterButton from "./ItemCounterButton";

interface ModifierGroupItemProps {
  modifier: Modifier;
  selection?: SelectedModifierTypes;
  onChange: (selection?: SelectedModifierTypes) => void;
  onGroupInteract?: (groupId?: string) => void;
  disabled?: boolean;
  depth?: number;
  errorGroupId?: string;
}

const formatRuleSummary = (rule: { min: number; max: number }) => {
  const range =
    rule.min === rule.max ? `${rule.max}` : `${rule.min}-${rule.max}`;
  return `${rule.min > 0 ? "Required" : "Optional"} · Select ${range}`;
};

function getTotalSelected(
  options: SelectedModifierOption[] | undefined
): number {
  return (options ?? []).reduce((acc, option) => acc + option.quantity, 0);
}

function mergeRuleOverrides(
  group: Modifier,
  overrides?: Partial<Modifier["rule"]>
): Modifier {
  if (!overrides) return group;
  return {
    ...group,
    rule: {
      min: typeof overrides.min === "number" ? overrides.min : group.rule.min,
      max: typeof overrides.max === "number" ? overrides.max : group.rule.max,
    },
  };
}

const ModifierGroupItem = ({
  modifier,
  selection,
  onChange,
  onGroupInteract,
  disabled,
  depth = 0,
  errorGroupId,
}: ModifierGroupItemProps) => {
  const isSingleSelect = modifier.rule.max <= 1;
  const selectedOptions = selection?.selectedOptions ?? [];
  const totalSelected = getTotalSelected(selectedOptions);
  const isErrored = errorGroupId === modifier.id;

  const emitChange = (options: SelectedModifierOption[]) => {
    if (options.length === 0) {
      onChange(undefined);
    } else {
      onChange({ groupId: modifier.id, selectedOptions: options });
    }
  };

  const handleToggleOption = (option: ModifierItem) => {
    if (disabled) return;
    onGroupInteract?.(modifier.id);

    const existingIndex = selectedOptions.findIndex(
      (item) => item.optionId === option.id
    );
    const existing =
      existingIndex >= 0 ? selectedOptions[existingIndex] : undefined;

    if (isSingleSelect) {
      if (existing) {
        emitChange([]);
      } else {
        emitChange([{ optionId: option.id, quantity: 1 }]);
      }
      return;
    }

    if (existing) {
      const nextOptions = selectedOptions.filter(
        (item) => item.optionId !== option.id
      );
      emitChange(nextOptions);
      return;
    }

    if (totalSelected >= modifier.rule.max) {
      return;
    }

    emitChange([...selectedOptions, { optionId: option.id, quantity: 1 }]);
  };

  const handleQuantityChange = (option: ModifierItem, delta: number) => {
    if (disabled) return;
    onGroupInteract?.(modifier.id);

    const idx = selectedOptions.findIndex(
      (item) => item.optionId === option.id
    );
    if (idx === -1) return;

    const current = selectedOptions[idx];
    if (!current) return;

    const nextQuantity = Math.min(
      Math.max(current.quantity + delta, 1),
      option.maxQuantity
    );

    const totalWithoutCurrent = totalSelected - current.quantity;
    if (totalWithoutCurrent + nextQuantity > modifier.rule.max) {
      return;
    }

    const nextOptions = [...selectedOptions];
    nextOptions[idx] = {
      ...current,
      quantity: nextQuantity,
      children: current.children,
    };
    emitChange(nextOptions);
  };

  const handleChildChange = (
    parentOption: ModifierItem,
    childLink: ModifierChildLink,
    childSelection?: SelectedModifierTypes
  ) => {
    const idx = selectedOptions.findIndex(
      (option) => option.optionId === parentOption.id
    );
    if (idx === -1) return;

    const current = selectedOptions[idx];
    if (!current) return;
    const existingChildren = current.children ?? [];
    const filtered = existingChildren.filter(
      (child) => child.groupId !== childLink.groupId
    );

    const nextChildren =
      childSelection && childSelection.selectedOptions.length > 0
        ? [...filtered, childSelection]
        : filtered;

    const nextOptions = [...selectedOptions];
    nextOptions[idx] = {
      ...current,
      children: nextChildren.length > 0 ? nextChildren : undefined,
    };

    emitChange(nextOptions);
  };

  const renderChildGroups = (
    option: ModifierItem,
    selectedOption: SelectedModifierOption | undefined
  ) => {
    if (!selectedOption) return null;
    if (!Array.isArray(option.childGroups) || option.childGroups.length === 0)
      return null;

    return (
      <div className="mt-3 space-y-3 border-l border-muted pl-3">
        {option.childGroups.map((link) => {
          if (!link.group) return null;
          const overriddenGroup = mergeRuleOverrides(
            link.group,
            link.overrides
          );
          const childSelection = selectedOption.children?.find(
            (child) => child.groupId === link.groupId
          );

          return (
            <div key={`${option.id}-${link.groupId}`} className="space-y-2">
              {link.applyPerParentQuantity && (
                <p className="text-[11px] text-muted-foreground">
                  Applies per quantity of {option.name}
                </p>
              )}
              <ModifierGroupItem
                modifier={overriddenGroup}
                selection={childSelection}
                onChange={(next) => handleChildChange(option, link, next)}
                onGroupInteract={onGroupInteract}
                disabled={disabled}
                depth={depth + 1}
                errorGroupId={errorGroupId}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      id={modifier.id}
      className={clsx(
        "scroll-mt-24 rounded-md border border-muted bg-background",
        depth > 0 && "bg-muted/20"
      )}
    >
      <div
        className={clsx(
          "flex min-h-10 items-center justify-between px-3 py-2",
          depth > 0 ? "bg-muted" : "bg-muted/50"
        )}
      >
        <p
          className={clsx(
            "text-xs font-semibold uppercase tracking-wide",
            isErrored && "text-destructive"
          )}
        >
          {modifier.name}
        </p>
        <p
          className={clsx(
            "text-xs font-medium text-muted-foreground",
            isErrored && "text-destructive"
          )}
        >
          {formatRuleSummary(modifier.rule)}
        </p>
      </div>

      <div className="divide-y divide-muted">
        {modifier.items.map((option) => {
          const selectedOption = selectedOptions.find(
            (item) => item.optionId === option.id
          );
          const isSelected = Boolean(selectedOption);

          return (
            <div key={option.id} className="px-3 py-2">
              <div className="flex min-h-10 flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${modifier.id}-${option.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleToggleOption(option)}
                      disabled={disabled}
                    />
                    <Label htmlFor={`${modifier.id}-${option.id}`}>
                      {option.name}
                    </Label>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {option.price && option.price !== "0"
                      ? `+ ${option.price}`
                      : "Included"}
                  </span>
                </div>

                {isSelected && !isSingleSelect && option.maxQuantity > 1 && (
                  <div onClick={(event) => event.stopPropagation()}>
                    <ItemCounterButton
                      small
                      value={selectedOption!.quantity}
                      onIncrease={(event) => {
                        event.stopPropagation();
                        handleQuantityChange(option, 1);
                      }}
                      onDecrease={(event) => {
                        event.stopPropagation();
                        handleQuantityChange(option, -1);
                      }}
                      disabled={disabled}
                      maxValue={option.maxQuantity}
                    />
                  </div>
                )}

                {renderChildGroups(option, selectedOption)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ModifierGroupItem;
