"use client";

import { cx } from "@/helper";
import { useScreenSize } from "@/hook/useScreenSize";
import { ReactNode, useEffect, useRef, useState } from "react";

type ResizableProps = {
  className?: string;
  left?: ReactNode;
  right?: ReactNode;
};

const Resizable = (props: ResizableProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [currentRatio, setCurrentRatio] = useState<number>(0.5);
  const { width } = useScreenSize();

  useEffect(() => {
    if (containerRef.current) {
      setLeftWidth(containerRef.current.offsetWidth / 2 - 13);
    }
    const zoomObserver = new MutationObserver(() => {
      if (containerRef.current) {
        setLeftWidth(containerRef.current.offsetWidth / 2 - 13);
      }
    });
    zoomObserver.observe(document.documentElement, {
      attributeFilter: ["style"],
    });
    return () => {
      zoomObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const onWindowResize = () => {
      if (containerRef.current) {
        setLeftWidth(currentRatio * containerRef.current.offsetWidth - 13);
      }
    };
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [currentRatio]);

  useEffect(() => {
    const resize = (event: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const newWidth =
          event.clientX - containerRef.current.getBoundingClientRect().left;
        setLeftWidth(newWidth);
        setCurrentRatio(newWidth / containerRef.current.offsetWidth);
      }
    };
    const cancelResize = () => {
      setIsResizing(false);
    };
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", cancelResize);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", cancelResize);
    };
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className={cx("w-full flex flex-col sm:flex-row", props.className)}
    >
      <div
        className="min-w-[20%] min-h-[inherit]"
        style={{ width: width <= 640 ? 'auto' : leftWidth + "px" }}
      >
        {props.left}
      </div>
      <div
        className={cx(
          "mx-[12px] w-[2px] min-h-[inherit] transition-transform rounded-full cursor-col-resize bg-gray-400 hidden sm:block",
          "hover:scale-x-[2]"
        )}
        onMouseDown={() => setIsResizing(true)}
        onClick={(e) => {
          if (e.detail === 2) {
            setCurrentRatio(0.5);
            if (containerRef.current) {
              setLeftWidth(0.5 * containerRef.current.offsetWidth - 13);
            }
          }
        }}
      ></div>
      <div className="flex-1 min-w-[20%] min-h-[inherit] mt-4 sm:mt-0">
        {props.right}
      </div>
    </div>
  );
};

export default Resizable;
