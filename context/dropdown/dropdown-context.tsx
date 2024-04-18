"use client";

import { createContext, useContext } from "react";

import { DropdownName } from "@/types";

type DropdownContextType = {
  activeDropdown?: DropdownName;
  toggleActiveDropdown: (dropdownName: DropdownName) => void;
  dropdownRefs?: React.MutableRefObject<
    { [key in DropdownName]?: HTMLDivElement } | null
  >;
};

export const DropdownContext = createContext<DropdownContextType>({
  toggleActiveDropdown: (_dropdownName: DropdownName) => {},
});

export const useDropdownContext = () => useContext(DropdownContext);
