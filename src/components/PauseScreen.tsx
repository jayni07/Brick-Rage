import React from "react";

interface ThemeColors {
  bgCard: string;
  border: string;
  buttonPrimary: string;
  titleGradient?: string;
  textSecondary: string;
  textMain: string;
}

interface PauseScreenProps {
  lives: number;
  continueGame: () => void;
  themeColors: ThemeColors;
  isLifeLossPause?: boolean; // Add optional flag
}

const PauseScreen: React.FC<PauseScreenProps> = ({
  lives,
  continueGame,
  themeColors,
  isLifeLossPause = false, // Default to false
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
      <div
        className={`${themeColors.bgCard} p-8 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4`}
      >
        <h2
          className={`text-3xl font-bold mb-4 ${
            themeColors.titleGradient
              ? themeColors.titleGradient + " bg-clip-text text-transparent"
              : themeColors.textMain
          }`}
        >
          {isLifeLossPause ? "Try Again!" : "Game Paused"}
        </h2>
        {isLifeLossPause && (
          <p className={`${themeColors.textSecondary} mb-2`}>
            You lost a life.
          </p>
        )}
        <p className={`${themeColors.textSecondary} mb-6`}>
          {isLifeLossPause
            ? `Lives remaining: ${lives}`
            : "Take a break or press continue."}
        </p>

        <button
          onClick={continueGame}
          className={`${themeColors.buttonPrimary} px-6 py-3 rounded-lg transition-transform hover:scale-105 w-full`}
        >
          {isLifeLossPause ? "Continue" : "Resume Game"}
        </button>
      </div>
    </div>
  );
};

export default PauseScreen;
