import { useRef, useEffect } from "react";

export const useIsFirstRender = () => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) return;

    isFirstRender.current = false;
  }, []);

  return isFirstRender.current;
};
