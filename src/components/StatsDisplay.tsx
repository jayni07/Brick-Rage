import React from "react";
import {
  HeartIcon,
  StarIcon,
  TrophyIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/solid"; // Assuming you use Heroicons

interface StatsDisplayProps {
  lives: number;
  score: number;
  highScore: number;
  level: number; // Add level prop
  themeColors: {
    stats: string;
    textSecondary: string;
    textMain: string; // Use textMain for better contrast on some themes
    titleGradient?: string; // Optional gradient for emphasis
  };
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  lives,
  score,
  highScore,
  level, // Destructure level
  themeColors,
}) => {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 rounded-xl shadow-md ${themeColors.stats}`}
    >
      {/* Lives */}
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <HeartIcon
          className={`h-5 w-5 ${
            themeColors.titleGradient
              ? "text-red-500"
              : themeColors.textSecondary
          }`}
        />
        <span className={`${themeColors.textMain} font-medium text-lg`}>
          {lives}
        </span>
        <span
          className={`${themeColors.textSecondary} text-xs hidden sm:inline`}
        >
          Lives
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <StarIcon
          className={`h-5 w-5 ${
            themeColors.titleGradient
              ? "text-yellow-400"
              : themeColors.textSecondary
          }`}
        />
        <span className={`${themeColors.textMain} font-medium text-lg`}>
          {score}
        </span>
        <span
          className={`${themeColors.textSecondary} text-xs hidden sm:inline`}
        >
          Score
        </span>
      </div>

      {/* High Score */}
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <TrophyIcon
          className={`h-5 w-5 ${
            themeColors.titleGradient
              ? "text-amber-500"
              : themeColors.textSecondary
          }`}
        />
        <span className={`${themeColors.textMain} font-medium text-lg`}>
          {highScore}
        </span>
        <span
          className={`${themeColors.textSecondary} text-xs hidden sm:inline`}
        >
          High Score
        </span>
      </div>

      {/* Level */}
      <div className="flex items-center justify-center sm:justify-start space-x-2">
        <Bars3BottomLeftIcon
          className={`h-5 w-5 ${
            themeColors.titleGradient
              ? "text-cyan-400"
              : themeColors.textSecondary
          }`}
        />
        <span className={`${themeColors.textMain} font-medium text-lg`}>
          {level}
        </span>
        <span
          className={`${themeColors.textSecondary} text-xs hidden sm:inline`}
        >
          Level
        </span>
      </div>
    </div>
  );
};

export default StatsDisplay;
