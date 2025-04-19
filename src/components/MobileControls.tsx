import React from "react";

// Define the full expected structure for themeColors based on page.tsx
interface ThemeColors {
  bgMain: string;
  bgSecondary: string;
  bgAccent: string;
  bgCard: string;
  bgGradient: string;
  textMain: string;
  textSecondary: string;
  border: string;
  stats: string;
  buttonPrimary: string;
  buttonSecondary: string;
  paddleBg: string;
  ballBg: string;
  brickGradient: string;
  titleGradient: string;
}

interface MobileControlsProps {
  gameStarted: boolean;
  gameOver: boolean;
  theme: "light" | "dark";
  setMoveDirection: (direction: string) => void;
  setIsPlayerMoving: (moving: boolean) => void;
  setPlayerPosition: (updater: (prev: number) => number) => void;
  gameWidth: number;
  playerWidth: number;
  resetGame: () => void;
  themeColors: ThemeColors; // Use the full ThemeColors interface
}

const MobileControls: React.FC<MobileControlsProps> = ({
  gameStarted,
  gameOver,
  setMoveDirection,
  setIsPlayerMoving,
  setPlayerPosition,
  gameWidth,
  playerWidth,
  resetGame,
  themeColors, // Now expects the full object
}) => {
  const handleMove = (direction: "left" | "right") => {
    if (gameStarted && !gameOver) {
      setMoveDirection(direction);
      setIsPlayerMoving(true);
      setPlayerPosition((prev) =>
        direction === "left"
          ? Math.max(prev - 5, 0)
          : Math.min(prev + 5, gameWidth - playerWidth)
      );
    }
  };

  return (
    <div className="md:hidden mt-4 relative z-10 w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={() => handleMove("left")}
            className={`${themeColors.buttonSecondary} p-4 rounded-xl shadow-lg transition-all duration-200 transform active:scale-95 focus:outline-none`}
            aria-label="Move left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => handleMove("right")}
            className={`${themeColors.buttonSecondary} p-4 rounded-xl shadow-lg transition-all duration-200 transform active:scale-95 focus:outline-none`}
            aria-label="Move right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {gameStarted && !gameOver && (
          <button
            onClick={resetGame}
            className={`${themeColors.buttonSecondary} p-3 rounded-xl shadow-md text-sm font-medium transition-all duration-200`}
            aria-label="Reset Game"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex justify-center mt-3">
        <span
          className={`${themeColors.textSecondary} text-xs flex items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Use buttons to move the paddle
        </span>
      </div>
    </div>
  );
};

export default MobileControls;
