import React from "react";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  themeColors: {
    buttonSecondary: string; // Assuming this is used for theme toggle button style
    titleGradient: string; // Added for title
  };
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, themeColors }) => {
  return (
    <header className="flex justify-between items-center mb-6 md:mb-8">
      <h1 className="text-3xl md:text-4xl font-bold font-space tracking-tight">
        <span
          className={`bg-clip-text text-transparent ${themeColors.titleGradient}`}
        >
          Brick Rage
        </span>
      </h1>

      <button
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        className={`p-2 rounded-full transition-colors ${themeColors.buttonSecondary} focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 shadow-sm`}
      >
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;
