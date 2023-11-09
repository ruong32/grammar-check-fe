import * as UnstyledSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "../icon";
import { cx } from "@/helper";
import { ReactNode } from "react";

const itemStyle = "px-2 py-2 rounded-md cursor-pointer hover:bg-indigo-600/20";
const activeItemStyle = "bg-indigo-600 text-gray-50 hover:bg-indigo-600";

type SelectProps = {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    label: ReactNode
    labelClassName?: string
    content: ReactNode
}

const Select = (props: SelectProps) => {
  return (
    <UnstyledSelect.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <UnstyledSelect.Trigger asChild>
        <div
          className={cx(
            "flex items-center",
            itemStyle,
            props.labelClassName
          )}
        >
          {props.label}
          <ChevronDown className="ml-2" height={20} width={20} />
        </div>
      </UnstyledSelect.Trigger>
      <UnstyledSelect.Portal>
        <UnstyledSelect.Content
          className="py-1 space-y-1 w-full rounded-md text-sm bg-gray-50 shadow-md dark:bg-gray-700"
          position="popper"
        >
          {/* {ENGLISH.map((accent) => (
            <div
              key={accent.code}
              onClick={() => {
                selectLanguage(accent);
                setOpenEnglishSelect(false);
                setSelectedEnglish(accent);
              }}
              className="px-2 py-1 flex items-center cursor-pointer outline-none hover:bg-gray-200/50 hover:dark:bg-gray-600"
            >
              <div>{accent.label}</div>
              {accent.code === selectedLanguage.code && (
                <Check height={20} width={20} className="ml-2 text-indigo-600" />
              )}
            </div>
          ))} */}
        </UnstyledSelect.Content>
      </UnstyledSelect.Portal>
    </UnstyledSelect.Root>
  );
};

export default Select;
