"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { DropdownName } from "@/types";
import { DropdownContext } from "./dropdown-context";

type Props = { children: ReactNode };

export const DropdownProvider: React.FC<Props> = ({ children }) => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownName>();
  const dropdownRefs = useRef<{ [key in DropdownName]?: HTMLDivElement }>({});

  const toggleActiveDropdown = (dropdownName: DropdownName) => {
    if (activeDropdown === dropdownName) return setActiveDropdown(undefined);

    setActiveDropdown(dropdownName);
  };

  const handleMousedown = useCallback(
    (e: MouseEvent) => {
      if (
        activeDropdown &&
        dropdownRefs.current &&
        !dropdownRefs?.current[activeDropdown]?.contains(e.target as Node)
      ) {
        setActiveDropdown(undefined);
      }
    },
    [activeDropdown],
  );

  useEffect(() => {
    document.addEventListener("click", handleMousedown);

    return () => document.removeEventListener("click", handleMousedown);
  }, [handleMousedown]);

  return (
    <DropdownContext.Provider
      value={{
        activeDropdown,
        toggleActiveDropdown,
        dropdownRefs,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};
