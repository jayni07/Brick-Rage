import React from "react";
import Player from "./Player";
import Brick from "./Brick";
import Ball from "./Ball";

// Define Brick and Ball types inline or import from a types file
interface BrickData {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

interface BallData {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

interface GameAreaProps {
  gameAreaRef: React.RefObject<HTMLDivElement>;
  theme: "light" | "dark";
  themeColors: {
    border: string;
    stats: string;
    paddleBg: string;
    ballBg: string;
    brickGradient: string;
    bgSecondary: string; // Added for inner background
  };
  gameStarted: boolean;
  gameOver: boolean;
  handleMouseMove: (e: React.MouseEvent) => void; // Keep mouse move
  playerRef: React.RefObject<HTMLDivElement>; // Paddle ref
  playerPosition: number; // Paddle position
  paddleWidth: number; // Renamed from playerWidth
  paddleHeight: number; // Renamed from playerHeight
  isPlayerMoving: boolean; // Paddle moving state
  moveDirection: string; // Paddle move direction
  bricks: BrickData[]; // Changed from coins
  ball: BallData; // Added ball state
  resetGame: () => void;
  isPaused: boolean; // Added
  togglePause: () => void; // Added
}

const GameArea: React.FC<GameAreaProps> = ({
  gameAreaRef,
  theme,
  themeColors,
  gameStarted,
  isPaused, // Use isPaused
  togglePause, // Use togglePause
  handleMouseMove, // Keep mouse move
  playerRef,
  playerPosition,
  paddleWidth, // Renamed
  paddleHeight, // Renamed
  isPlayerMoving,
  moveDirection,
  bricks, // Changed
  ball, // Added
  resetGame,
}) => {
  return (
    <div
      ref={gameAreaRef}
      className={`flex-1 relative w-full rounded-2xl overflow-hidden shadow-lg border ${themeColors.border} mb-4`}
      onMouseMove={handleMouseMove} // Keep mouse move
    >
      {/* Inner Background respects theme */}
      <div
        className={`absolute inset-0 ${themeColors.bgSecondary}`} // Use bgSecondary from theme
      >
        <div
          className={`absolute inset-0 opacity-5`} // Keep subtle pattern
        >
          <div className="grid-pattern"></div>
        </div>
      </div>

      {gameStarted && (
        <>
          {/* Conditionally render game elements only if not paused */}
          {!isPaused && (
            <>
              {/* Player component now represents the Paddle */}
              <Player
                playerRef={playerRef}
                playerPosition={playerPosition}
                playerWidth={paddleWidth} // Use renamed prop
                playerHeight={paddleHeight} // Use renamed prop
                isPlayerMoving={isPlayerMoving}
                moveDirection={moveDirection}
                theme={theme}
                themeColors={themeColors} // Pass themeColors
              />

              {/* Render Bricks */}
              {bricks
                .filter((brick) => brick.active)
                .map((brick) => (
                  <Brick
                    key={brick.id}
                    x={brick.x}
                    y={brick.y}
                    width={brick.width}
                    height={brick.height}
                    theme={theme}
                    themeColors={themeColors} // Pass themeColors
                  />
                ))}

              {/* Render Ball */}
              <Ball
                x={ball.x}
                y={ball.y}
                radius={ball.radius}
                theme={theme}
                themeColors={themeColors} // Pass themeColors
              />
            </>
          )}

          {/* Buttons Container */}
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Pause Button */}
            <button
              onClick={togglePause}
              className={`${themeColors.stats} p-2 rounded-full text-sm shadow-lg hover:scale-110 transition-all`}
              aria-label={isPaused ? "Resume Game" : "Pause Game"}
            >
              {isPaused ? (
                // Play Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Pause Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zm5 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className={`${themeColors.stats} p-2 rounded-full text-sm shadow-lg hover:scale-110 transition-all`}
              aria-label="Reset Game"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          </div>
        </>
      )}
    </div>
  );
};

export default GameArea;
