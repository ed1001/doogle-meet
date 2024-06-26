import { useEffect } from "react";
import { motion } from "framer-motion";

import { DropdownName, DropdownOption } from "@/types";
import { useDropdownContext } from "@/context/dropdown/dropdown-context";
import { CheckMark } from "@/icons/CheckMark";

type Props = {
  name: DropdownName;
  visible: boolean;
  options: DropdownOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  upwards?: boolean;
};

export const Dropdown: React.FC<Props> = ({
  name,
  options,
  visible,
  onChange,
  selectedValue,
  upwards,
}) => {
  const { dropdownRefs, toggleActiveDropdown } = useDropdownContext();

  const handleSelectOption = (value: string) => {
    onChange(value);
    toggleActiveDropdown(name);
  };

  useEffect(() => {
    const element = dropdownRefs?.current?.[name];
    if (!element) return;

    const { parentElement } = element;

    if (parentElement) {
      const { offsetLeft, offsetTop, clientHeight } = parentElement;
      const heightOffset = upwards ? 0 : clientHeight;
      const left = offsetLeft;
      let top = offsetTop + heightOffset;

      if (upwards) top -= element.clientHeight;

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
    }
  }, [visible, dropdownRefs, name, upwards]);

  return (
    <motion.div
      ref={(element) => {
        if (!dropdownRefs?.current || !element) return;

        dropdownRefs.current[name] = element;
      }}
      className={`absolute flex flex-col rounded bg-white py-2 ${visible ? "block" : "hidden"}
      shadow`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {options.map((option) => (
        <DropdownItem
          key={option.key}
          option={option}
          selected={option.value === selectedValue}
          onClick={handleSelectOption}
        />
      ))}
    </motion.div>
  );
};

const DropdownItem = ({
  option,
  selected,
  onClick,
}: {
  option: DropdownOption;
  selected: boolean;
  onClick: (value: string) => void;
}) => {
  return (
    <div
      onClick={() => onClick(option.value)}
      className={`relative flex w-72 items-center py-3 pl-8 pr-2 hover:bg-gray-100 ${
        selected ? "text-highlight" : "text-black"
      }`}
    >
      {selected ? <CheckMark className="absolute left-2" /> : null}
      <div className="truncate text-xs">{option.label}</div>
    </div>
  );
};
