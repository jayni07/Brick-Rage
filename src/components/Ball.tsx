import React from "react";

interface BallProps {
  x: number;
  y: number;
  radius: number;
  theme: "light" | "dark";
  themeColors: {
    ballBg: string;
  };
}

const Ball: React.FC<BallProps> = ({ x, y, radius, themeColors }) => {
  const ballSizePercent = radius * 2; // Diameter

  return (
    <div
      className={`absolute ${themeColors.ballBg} rounded-full shadow-md transition-colors duration-300`} // Added rounded-full
      style={{
        left: `${x - radius}%`,
        top: `${y - radius}%`,
        width: `${ballSizePercent}%`,
        paddingBottom: `${ballSizePercent}%`, // Use paddingBottom for aspect ratio 1:1
        height: 0, // Set height to 0 when using paddingBottom for aspect ratio
      }}
    />
  );
};

export default Ball;
