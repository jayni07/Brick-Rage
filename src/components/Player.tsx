import React from "react";

interface PlayerProps {
  playerRef: React.RefObject<HTMLDivElement>;
  playerPosition: number;
  playerWidth: number;
  playerHeight: number;
  isPlayerMoving: boolean;
  moveDirection: string;
  theme: "light" | "dark";
  themeColors: {
    paddleBg: string;
  };
}

const Player: React.FC<PlayerProps> = ({
  playerRef,
  playerPosition,
  playerWidth,
  playerHeight,
  themeColors,
}) => {
  return (
    <div
      ref={playerRef}
      className={`absolute z-10 ${themeColors.paddleBg} rounded-sm`}
      style={{
        left: `${playerPosition}%`,
        bottom: "5%",
        width: `${playerWidth}%`,
        height: `${playerHeight}%`,
      }}
    ></div>
  );
};

export default Player;
