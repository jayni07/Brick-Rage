import React from "react";

interface BrickProps {
  x: number;
  y: number;
  width: number;
  height: number;
  theme: "light" | "dark";
  themeColors: {
    brickGradient: string;
    border: string;
  };
}

const Brick: React.FC<BrickProps> = ({
  x,
  y,
  width,
  height,
  themeColors,
}) => {
  return (
    <div
      className={`absolute ${themeColors.brickGradient} rounded-sm shadow-md border border-black/20`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    />
  );
};

export default Brick;
