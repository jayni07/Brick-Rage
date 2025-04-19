import React from "react";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  didWin: boolean;
  startGame: () => void;
  resetGame: () => void;
  themeColors: {
    bgCard: string;
    border: string;
    bgSecondary: string; // Used for score box background
    buttonPrimary: string; // Primary button style class
    buttonSecondary: string; // Secondary button style class
    titleGradient: string; // Title gradient class
    textSecondary: string; // Secondary text color
    textMain: string; // Main text color
  };
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  didWin,
  startGame,
  resetGame,
  themeColors,
}) => {
  const isNewHighScore = score > 0 && score >= highScore;

  return (
    // Ensure overlay covers game area
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 transition-all z-40 p-4">
      {/* Apply card styles */}
      <div
        className={`max-w-md w-full p-6 md:p-8 rounded-xl shadow-xl ${themeColors.bgCard} border ${themeColors.border} scale-in`}
      >
        {/* Apply title gradient */}
        <h2
          className={`text-2xl md:text-3xl font-bold mb-5 text-center font-space bg-clip-text text-transparent ${themeColors.titleGradient}`}
        >
          {didWin ? "You Win!" : "Game Over"}
        </h2>

        {/* Icon display */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            {/* Use accent color for win, maybe red/pink for loss */}
            <div
              className={`absolute inset-0 rounded-full ${
                didWin ? "bg-cyan-500/30" : "bg-pink-500/30"
              } animate-ping-slow`}
            ></div>
            <div className="relative flex items-center justify-center w-full h-full text-4xl">
              {didWin ? "🎉" : "💔"}
            </div>
          </div>
        </div>

        {/* Score Display Box */}
        <div className="mb-6">
          <div
            // Use secondary background, adjust padding/rounding
            className={`text-center p-4 rounded-lg ${themeColors.bgSecondary} shadow-inner`}
          >
            <p
              className={`text-xs uppercase font-semibold tracking-wider ${themeColors.textSecondary} mb-0.5`}
            >
              Final Score
            </p>
            <p className={`font-bold text-3xl font-space ${themeColors.textMain}`}>
              {score}
            </p>
          </div>
        </div>

        {/* High Score Banner */}
        {isNewHighScore && (
          // Use accent color for banner
          <div className="bg-cyan-600/80 p-3 rounded-lg mb-6 text-white animate-pulse-slow shadow-lg">
            <p className="font-bold text-sm flex items-center justify-center">
              <span className="text-lg mr-2">🏆</span> New High Score!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Apply primary button style */}
          <button
            onClick={startGame}
            className={`${themeColors.buttonPrimary} flex-1 py-3 px-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105 active:scale-100 flex items-center justify-center gap-2`}
          >
            <svg
              /* Play icon */ xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Play Again
          </button>

          {/* Apply secondary button style */}
          <button
            onClick={resetGame}
            className={`${themeColors.buttonSecondary} flex-1 py-3 px-4 rounded-lg text-base transition-all duration-300 transform hover:scale-105 active:scale-100 flex items-center justify-center gap-2`}
          >
            <svg
              /* Reset/Home icon */ xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
