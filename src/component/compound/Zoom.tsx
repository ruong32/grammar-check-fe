"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { cx, debounce } from "@/helper";
import { Check, Zoom as ZoomIcon } from "../icon";
import { useI18nClient } from "@/hook/useI18nClient";
import { STORAGE_KEY } from "@/common";
import { useScreenSize } from "@/hook/useScreenSize";

type ZoomProps = {
  className?: string;
};

const ZOOM_RATIO = [1, 1.25, 1.5] as const;

const Zoom = (props: ZoomProps) => {
  const [t] = useI18nClient();
  const [currentZoom, setCurrentZoom] =
    useState<(typeof ZOOM_RATIO)[number]>(1.5);
  const [open, setOpen] = useState<boolean>(false);
  const [enable, setEnable] = useState<boolean>(true);
	const { width } = useScreenSize()

  useLayoutEffect(() => {
    const storedRatio = parseFloat(
      localStorage.getItem(STORAGE_KEY.ZOOM_RATIO) || "1.5"
    );
    if (ZOOM_RATIO.some((ratio) => ratio === storedRatio)) {
      setCurrentZoom(storedRatio as (typeof ZOOM_RATIO)[number]);
    }
    if (width <= 876) {
      setEnable(false);
    }
  }, []);

	useEffect(() => {
		if (width < 876) {
			setEnable(false)
		} else {
			setEnable(true)
		}
	}, [width])

  useEffect(() => {
    if (!enable) {
      document.documentElement.style.fontSize = "100%";
    } else {
      document.documentElement.style.fontSize = `${currentZoom * 100}%`;
    }
  }, [enable]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${currentZoom * 100}%`;
  }, [currentZoom]);

  const onOptionClick = (zoomRatio: (typeof ZOOM_RATIO)[number]) => {
    setOpen(false);
    setCurrentZoom(zoomRatio);
    localStorage.setItem(STORAGE_KEY.ZOOM_RATIO, String(zoomRatio));
  };

  return (
    <div
      className={cx(
        "relative text-[14px] leading-[20px]",
        props.className,
        !enable ? "hidden" : ""
      )}
    >
      <div
        className={cx(
          "flex items-center p-[8px] rounded-lg bg-slate-300 transition-[filter] select-none",
          "dark:bg-slate-700",
          "hover:cursor-pointer hover:brightness-95"
        )}
        onClick={() => setOpen(!open)}
      >
        <ZoomIcon className="mr-[4px] cursor-pointer" />
        {t("zoom")}
      </div>
      <div
        className={cx(
          "absolute w-full bottom-full pt-[8px] pb-[8px] mb-[4px] bg-slate-300 rounded-md opacity-0 invisible pointer-events-none transition-opacity duration-300",
          "dark:bg-slate-700",
          open ? "opacity-100 visible pointer-events-auto" : ""
        )}
      >
        {ZOOM_RATIO.map((option) => (
          <div
            key={option}
            className={cx(
              "pt-[4px] pb-[4px] pl-[8px] pr-[8px] bg-slate-300 flex justify-between items-center",
              "dark:bg-slate-700",
              "hover:cursor-pointer hover:brightness-95"
            )}
            onClick={() => onOptionClick(option)}
          >
            <span>{option}x</span>
            {option === currentZoom && (
              <Check className="text-green-600" height={18} width={18} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zoom;
