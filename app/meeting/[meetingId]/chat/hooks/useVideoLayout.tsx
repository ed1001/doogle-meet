import { leastCommonMultiple } from "@/lib/numbers";
import { useRef, useState, useEffect, useCallback } from "react";

export const useVideoLayout = (videoCount: number) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [maxVideoHeight, setMaxVideoHeight] = useState<number>(200);

  const updateGrid = useCallback(() => {
    if (!gridRef.current || !gridContainerRef.current) {
      return;
    }

    const containerHeight = gridContainerRef.current.clientHeight;
    const containerWidth = gridContainerRef.current.clientWidth;
    const containerArea = containerHeight * containerWidth;
    const aspectRatio = 16 / 9;

    let columns = 1;
    let rows = Math.ceil(videoCount / columns);
    let optimalColumns = columns;
    let optimalRows = rows;
    let lastRemainingSpace = Infinity;
    let videoWidth = 1600;
    let videoHeight = 900;
    const gapCompensation = parseInt(getComputedStyle(gridRef.current).gap) * 2;

    while (true) {
      rows = Math.ceil(videoCount / columns);
      let cellHeight = containerHeight / rows + gapCompensation;
      let cellWidth = cellHeight * aspectRatio + gapCompensation;
      const maxVideoPerRow = Math.floor(videoCount / rows);
      const cropWidth = maxVideoPerRow * cellWidth > containerWidth;

      if (cropWidth) {
        cellWidth = containerWidth / maxVideoPerRow;
        cellHeight = cellWidth / aspectRatio;
      }

      const cropHeight = cellHeight * rows > containerHeight;

      if (cropHeight) {
        cellHeight = containerHeight / rows;
        cellWidth = cellHeight * aspectRatio;
      }

      const occupiedSpace = cellHeight * cellWidth * videoCount;
      const currentRemainingSpace = containerArea - occupiedSpace;

      if (currentRemainingSpace < lastRemainingSpace) {
        lastRemainingSpace = currentRemainingSpace;
        optimalColumns = columns;
        optimalRows = rows;
        videoHeight = cellHeight - gapCompensation;
        videoWidth = videoHeight * aspectRatio;
        columns++;
        continue;
      }

      break;
    }

    gridRef.current.style.width = `${videoWidth * optimalColumns}px`;
    const remainder = videoCount % optimalColumns;
    let commonMultiple = leastCommonMultiple(optimalColumns, remainder) || 1;
    optimalColumns = optimalColumns * commonMultiple;
    const cells = Array.from(gridRef.current.children) as HTMLElement[];

    for (const cell of cells) {
      cell.style.gridColumn = `span ${commonMultiple}`;
    }

    if (remainder) {
      const remainingCells = [...cells].slice(-remainder);
      const emptyColumns = optimalColumns - commonMultiple * remainder;
      let shiftRightBy = (emptyColumns / 2 + 1).toString();

      for (const cell of remainingCells) {
        cell.style.gridColumn = `${shiftRightBy} / span ${commonMultiple} `;
        shiftRightBy += commonMultiple;
      }
    }

    setMaxVideoHeight(videoHeight);
    gridRef.current.style.gridTemplateColumns = `repeat(${optimalColumns}, 1fr)`;
    gridRef.current.style.gridTemplateRows = `repeat(${optimalRows}, 1fr)`;
  }, [videoCount]);

  useEffect(() => {
    updateGrid();

    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, [updateGrid]);

  return { gridContainerRef, gridRef, maxVideoHeight };
};
