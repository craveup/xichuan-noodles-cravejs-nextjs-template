"use client";

import React from "react";
import type {
  Modifier,
  SelectedModifierTypes,
} from "@/lib/api/types";
import ModifierGroupItem from "./ModifierGroupItem";

interface ModifierGroupProps {
  modifiers: Modifier[];
  selections: SelectedModifierTypes[];
  setSelections: React.Dispatch<React.SetStateAction<SelectedModifierTypes[]>>;
  disabled?: boolean;
  errorModifierGroupId?: string;
  onGroupInteract?: (groupId?: string) => void;
}

const ModifierGroup = ({
  modifiers,
  selections,
  setSelections,
  disabled,
  errorModifierGroupId,
  onGroupInteract,
}: ModifierGroupProps) => {
  const updateGroupSelection = (
    groupId: string,
    next?: SelectedModifierTypes
  ) => {
    setSelections((prev) => {
      const others = prev.filter((group) => group.groupId !== groupId);
      if (!next || next.selectedOptions.length === 0) {
        return others;
      }
      return [...others, next];
    });
  };

  if (!Array.isArray(modifiers) || modifiers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {modifiers.map((modifier) => {
        const selection = selections.find(
          (selected) => selected.groupId === modifier.id
        );
        return (
          <ModifierGroupItem
            key={modifier.id}
            modifier={modifier}
            selection={selection}
            onChange={(next) => updateGroupSelection(modifier.id, next)}
            disabled={disabled}
            errorGroupId={errorModifierGroupId}
            onGroupInteract={onGroupInteract}
          />
        );
      })}
    </div>
  );
};

export default ModifierGroup;
