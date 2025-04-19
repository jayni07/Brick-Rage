import React from "react";

interface FooterProps {
  theme: "light" | "dark";
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer className="mt-auto pt-4 text-center">
      <p
        className={`text-xs ${
          theme === "dark" ? "text-zinc-600" : "text-gray-400"
        }`}
      >
        © 2025 Coin Catcher Game
      </p>
    </footer>
  );
};

export default Footer;
