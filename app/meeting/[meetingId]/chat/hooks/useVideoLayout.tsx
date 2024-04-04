import { lcm } from "@/lib/numbers";
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
    let remainingSpace = Infinity;
    const { gap: gapString } = getComputedStyle(gridRef.current);
    const gap = parseInt(gapString);
    const dimensionAdjustment = gap * 2;
    let videoHeight;
    let videoWidth;

    while (true) {
      rows = Math.ceil(videoCount / columns);
      let cellHeight = containerHeight / rows + dimensionAdjustment;
      let cellWidth = cellHeight * aspectRatio + dimensionAdjustment;

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

      const cellAreaSingle = cellHeight * cellWidth;
      const cellAreaTotal = cellAreaSingle * videoCount;
      const currentRemainingSpace = containerArea - cellAreaTotal;

      if (currentRemainingSpace < remainingSpace) {
        remainingSpace = currentRemainingSpace;
        optimalColumns = columns;
        optimalRows = rows;
        videoHeight = cellHeight - dimensionAdjustment;
        videoWidth = videoHeight * aspectRatio;
        columns++;
        continue;
      }

      break;
    }

    setMaxVideoHeight(videoHeight!);

    gridRef.current.style.width = `${videoWidth! * optimalColumns}px`;

    const remainder = videoCount % optimalColumns;

    let multiply = lcm(optimalColumns, remainder) || 1;
    optimalColumns = optimalColumns * multiply;
    const cells = Array.from(gridRef.current.children) as HTMLElement[];

    for (const cell of cells) {
      cell.style.gridColumn = `span ${multiply}`;
    }

    if (remainder) {
      const remainingCells = [...cells].slice(-remainder);
      const emptyCols = optimalColumns - multiply * remainder;
      let shiftBy = emptyCols / 2;

      for (const cell of remainingCells) {
        cell.style.gridColumn = `${(shiftBy + 1).toString()} / span ${multiply} `;
        shiftBy += multiply;
      }
    }

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
