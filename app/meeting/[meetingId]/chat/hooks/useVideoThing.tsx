import { useRef, useState, useEffect, useCallback } from "react";

export const useVideoLayout = (videoCount: number) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [maxVideoHeight, setMaxVideoHeight] = useState<number>(200);

  const updateGrid = useCallback(() => {
    if (!gridRef.current) {
      return;
    }

    const gridHeight = gridRef.current.clientHeight;
    let optimalColumns = Math.ceil(Math.sqrt(videoCount));
    let optimalRows = Math.ceil(videoCount / optimalColumns);
    const maxHeight = gridHeight / optimalRows;

    setMaxVideoHeight(maxHeight);

    gridRef.current.style.gridTemplateColumns = `repeat(${optimalColumns}, 1fr)`;
    gridRef.current.style.gridTemplateRows = `repeat(${optimalRows}, 1fr)`;
  }, [videoCount]);

  useEffect(() => {
    updateGrid();

    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  return { gridRef, maxVideoHeight };
};
