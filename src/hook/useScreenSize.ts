import { debounce } from "@/helper";
import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const onResize = debounce(() => {
      setWidth(document.body.clientWidth);
      setHeight(document.body.clientHeight);
    }, 10);
		onResize()
    window.addEventListener("resize", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return { height, width };
};
