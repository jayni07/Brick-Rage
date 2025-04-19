import React from "react";

interface StartScreenProps {
  startGame: () => void;
  highScore: number;
  themeColors: {
    bgCard: string;
    border: string;
    buttonPrimary: string; // Primary button style class
    titleGradient: string; // Title gradient class
    textSecondary: string; // Secondary text color
    textMain: string; // Added for contrast
  };
  theme: "light" | "dark"; // Added theme prop
}

const StartScreen: React.FC<StartScreenProps> = ({
  startGame,
  highScore,
  themeColors,
  theme, // Use theme
}) => {
  // Define text color based on theme for specific elements needing high contrast
  const contrastTextColor =
    theme === "light" ? "text-slate-800" : "text-slate-200";
  const secondaryContrastTextColor =
    theme === "light" ? "text-slate-600" : themeColors.textSecondary;

  return (
    // Ensure overlay covers the game area
    <div className="absolute inset-0 flex items-center justify-center z-30 p-4">
      {/* Apply card styles */}
      <div
        className={`max-w-md w-full p-6 md:p-8 rounded-xl shadow-2xl ${themeColors.bgCard} border ${themeColors.border}`}
      >
        {/* Apply title gradient */}
        <h2
          className={`text-3xl md:text-4xl font-bold mb-6 text-center font-space bg-clip-text text-transparent ${themeColors.titleGradient}`}
        >
          Brick Rage
        </h2>

        {/* Simplified icon display */}
        <div className="relative py-6 flex justify-center items-center text-4xl md:text-5xl mb-4">
          🧱
          <span className={`mx-3 text-3xl ${secondaryContrastTextColor}`}>
            🆚
          </span>
          <span className="text-3xl">⚪</span>{" "}
          {/* Using white circle for ball */}
        </div>

        {/* Use secondary contrast color for main text, strong contrast for lives */}
        <p className={`mb-8 text-center ${secondaryContrastTextColor}`}>
          Break all the bricks! Use your mouse to control the paddle. You have{" "}
          <span className={`font-bold ${contrastTextColor}`}>
            3 lives
          </span>
          .
        </p>

        {/* Apply primary button style */}
        <button
          onClick={startGame}
          className={`${themeColors.buttonPrimary} w-full py-3 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 active:scale-100`} // Added transitions
        >
          Start Game
        </button>

        {/* Use secondary contrast color for high score label, strong contrast for value */}
        {highScore > 0 && (
          <p
            className={`mt-5 text-sm text-center ${secondaryContrastTextColor}`}
          >
            High Score:{" "}
            <span className={`font-bold ${contrastTextColor}`}>
              {highScore}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default StartScreen;
