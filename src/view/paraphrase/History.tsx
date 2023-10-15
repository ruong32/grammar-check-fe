"use client";

import { cx } from "@/helper";
import { Clock, EmptyBox, History as HistoryIcon, RightDownCurveArrow } from "@/component/icon";
import { useEffect, useRef, useState } from "react";
import { STORAGE_KEY } from "@/common";
import { HistoryItem } from "@/types";
import { useI18nClient } from "@/hook/useI18nClient";
import { useOnClickOutside } from "@/hook/useOnClickOutside";

type HistoryProps = {
  onHistoryClick?: (item: HistoryItem) => void;
};

const History = (props: HistoryProps) => {
  const [t] = useI18nClient();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    setHistoryItems(
      JSON.parse(localStorage.getItem(STORAGE_KEY.HISTORY) || "[]")
    );
  }, [open]);

  const onItemClick = (item: HistoryItem, index: number) => {
    item.createdAt = new Date().getTime();
    const items = [...historyItems];
    items.splice(index, 1);
    items.unshift(item);
    localStorage.setItem(STORAGE_KEY.HISTORY, JSON.stringify(items));
    setOpen(false);
    props.onHistoryClick?.(item);
  };

  return (
    <div ref={ref} className="relative z-10">
      <div
        className={cx(
          "p-2 rounded-lg bg-slate-300 cursor-pointer select-none",
          "hover:bg-green-500 hover:text-gray-50",
          "dark:bg-slate-700 dark:hover:bg-green-500 dark:hover:text-gray-50"
        )}
        onClick={() => setOpen(!open)}
      >
        <HistoryIcon />
      </div>
      <div
        className={cx(
          "absolute top-full left-0 mt-1 p-2 rounded-lg bg-slate-300 text-gray-950",
          "scrollbar w-[calc(100vw-2rem)] max-h-80 shadow-md",
          "transition-opacity duration-300",
          "md:w-[28rem] md:right-0 md:left-auto",
          "dark:bg-slate-700 dark:text-gray-50",
          open ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="font-semibold">{t("history")}</div>
        {historyItems.length > 0 ? (
          historyItems.map((item, index) => (
            <div
              key={item.createdAt}
              className={cx(
                "mt-2 p-2 bg-gray-100 rounded-lg cursor-pointer",
                "hover:bg-gray-200",
                "dark:bg-gray-900 dark:hover:bg-gray-800"
              )}
              onClick={() => onItemClick(item, index)}
            >
              <div className="text-sm line-clamp-2 text-gray-500 dark:text-gray-400">
                {item.input}
              </div>
              <div className="mt-1 text-sm line-clamp-2">
                <RightDownCurveArrow className="inline text-green-600"/>{" "}
                {item.result}
              </div>
              <div className="flex justify-end mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock height="1rem" width="1rem" className="mr-1" />
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <div
            className={cx(
              "mt-1 flex flex-col justify-center items-center py-3 rounded-lg",
              "bg-slate-200 text-gray-500 dark:bg-gray-900 dark:text-gray-400"
            )}
          >
            <EmptyBox height="3rem" width="3rem" />
            <div>{t("noHistory")}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
