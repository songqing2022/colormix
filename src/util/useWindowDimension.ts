import { useState, useEffect, useMemo } from "react";

const useWindowDimension = (boardWidth:number) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimension = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  const cellWidth = useMemo(() => {
    return Math.floor((width * 0.6) / (2 + boardWidth));
  }, [width, boardWidth]);
  useEffect(() => {
    window.addEventListener("resize", updateDimension, true);

    return () => window.removeEventListener("resize", updateDimension, true);
  }, []);

  return { width, height, cellWidth };
};

export default useWindowDimension;
