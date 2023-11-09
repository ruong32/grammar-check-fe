"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { cx } from "@/helper";
import { Check, Zoom as ZoomIcon } from "../icon";
import { useI18nClient } from "@/hook/useI18nClient";
import { STORAGE_KEY } from "@/common";
import { useScreenSize } from "@/hook/useScreenSize";
import { Slider } from "../atom";

type ZoomProps = {
  className?: string;
  type?: "select" | "slider";
};

const ZOOM_RATIO = [1, 1.25, 1.5] as const;
const DEFAULT_ZOOM = 1.35;

const Zoom = ({ type = "select", ...props }: ZoomProps) => {
  const [t] = useI18nClient();
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [open, setOpen] = useState<boolean>(false);
  const [enable, setEnable] = useState<boolean>(true);
  const { width } = useScreenSize();

  useLayoutEffect(() => {
    const storedRatio = parseFloat(
      localStorage.getItem(STORAGE_KEY.ZOOM_RATIO) || String(DEFAULT_ZOOM)
    );
    if (typeof storedRatio === "number" && !Number.isNaN(storedRatio)) {
      setCurrentZoom(storedRatio as (typeof ZOOM_RATIO)[number]);
    }
    if (width <= 876) {
      setEnable(false);
    }
  }, []);

  useEffect(() => {
    if (width < 876) {
      setEnable(false);
    } else {
      setEnable(true);
    }
  }, [width]);

  useEffect(() => {
		if (enable) {
			localStorage.setItem(STORAGE_KEY.ZOOM_RATIO, String(currentZoom));
			document.documentElement.style.fontSize = `${currentZoom * 100}%`;
		} else {
      document.documentElement.style.fontSize = "100%";
		}
  }, [currentZoom, enable]);

  const onOptionClick = (zoomRatio: (typeof ZOOM_RATIO)[number]) => {
    setOpen(false);
    setCurrentZoom(zoomRatio);
  };

	if (!enable) {
		return t('notSupportZoom')
	}

  if (type === "slider") {
    return (
      <div className="flex text-xs items-center">
        <span className="mr-2">100</span>
        <Slider
          thumbTitle={`${currentZoom * 100}%`}
          className="w-full"
          value={[currentZoom * 100]}
          min={100}
          max={150}
          step={5}
          onValueChange={(value) => setCurrentZoom(value[0] / 100)}
        />
        <span className="ml-2">150%</span>
      </div>
    );
  }

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
        {t("zoom")} {currentZoom}x
      </div>
      <div
        className={cx(
          "absolute w-full top-full pt-[8px] pb-[8px] mt-[4px] bg-slate-300 rounded-md opacity-0 invisible pointer-events-none transition-opacity duration-300",
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
