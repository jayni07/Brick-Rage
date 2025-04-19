"use client";

import { useState, useEffect, useRef } from "react";
import { Poppins, Space_Grotesk } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
});

export default function CoinCatcherGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [coins, setCoins] = useState<
    { id: number; x: number; y: number; type: string }[]
  >([]);
  const [gameSpeed, setGameSpeed] = useState(1.5);
  const [lastCoinTime, setLastCoinTime] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const coinIdRef = useRef(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Timer related state
  const [timeRemaining, setTimeRemaining] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Game dimensions
  const playerWidth = 60;
  const playerHeight = 60;
  const coinSize = 30;
  const gameWidth = 100;

  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("coinCatcherHighScore");
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  });

  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState("none");
  const [coinCollected, setCoinCollected] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCoins([]);
    setGameSpeed(1.5);
    setPlayerPosition(50);
    setLevel(1);
    setTimeRemaining(60);
    coinIdRef.current = 0;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCoins([]);
    setTimeRemaining(60);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver || !isDragging || !gameAreaRef.current) return;

    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - gameRect.left;
    const gameAreaWidth = gameRect.width;

    const mousePositionPercent = (mouseX / gameAreaWidth) * 100;

    if (mousePositionPercent < playerPosition) {
      setMoveDirection("left");
    } else if (mousePositionPercent > playerPosition) {
      setMoveDirection("right");
    }

    setIsPlayerMoving(true);

    const newPosition = Math.max(
      0,
      Math.min(
        mousePositionPercent - playerWidth / 20,
        gameWidth - playerWidth / 10
      )
    );

    setPlayerPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPlayerMoving(false);
    setMoveDirection("none");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || !isDragging || !gameAreaRef.current) return;

    const touch = e.touches[0];
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const touchX = touch.clientX - gameRect.left;
    const gameAreaWidth = gameRect.width;

    const touchPositionPercent = (touchX / gameAreaWidth) * 100;

    if (touchPositionPercent < playerPosition) {
      setMoveDirection("left");
    } else if (touchPositionPercent > playerPosition) {
      setMoveDirection("right");
    }

    setIsPlayerMoving(true);

    const newPosition = Math.max(
      0,
      Math.min(
        touchPositionPercent - playerWidth / 20,
        gameWidth - playerWidth / 10
      )
    );

    setPlayerPosition(newPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPlayerMoving(false);
    setMoveDirection("none");
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setIsPlayerMoving(true);
        setMoveDirection("left");
        setPlayerPosition((prev) => Math.max(prev - 5, 0));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setIsPlayerMoving(true);
        setMoveDirection("right");
        setPlayerPosition((prev) =>
          Math.min(prev + 5, gameWidth - playerWidth / 10)
        );
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "ArrowRight" ||
        e.key === "d"
      ) {
        setIsPlayerMoving(false);
        setMoveDirection("none");
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setIsPlayerMoving(false);
        setMoveDirection("none");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [gameStarted, gameOver, isDragging]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem("coinCatcherHighScore", score.toString());
      }
    }
  }, [score, highScore]);

  useEffect(() => {
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score, level]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const updateGameState = (time: number) => {
      if (time - lastCoinTime > 1000 - level * 40) {
        setLastCoinTime(time);
        const coinTypes = ["gold", "silver", "diamond"];
        const randomType =
          coinTypes[Math.floor(Math.random() * coinTypes.length)];

        const newCoin = {
          id: coinIdRef.current++,
          x: Math.random() * (gameWidth - coinSize / 10),
          y: -5,
          type: randomType,
        };
        setCoins((prevCoins) => [...prevCoins, newCoin]);
      }

      setCoins((prevCoins) => {
        const updatedCoins = prevCoins.map((coin) => {
          const timePercent = (60 - timeRemaining) / 60;
          const speedMultiplier = 1 + timePercent * 0.8 + level * 0.05;

          const updatedY = coin.y + gameSpeed * speedMultiplier;

          const playerLeft = playerPosition;
          const playerRight = playerPosition + playerWidth / 10;
          const playerTop = 90 - playerHeight / 10;
          const coinLeft = coin.x;
          const coinRight = coin.x + coinSize / 10;
          const coinBottom = updatedY + coinSize / 10;

          if (
            coinBottom >= playerTop &&
            coinRight >= playerLeft &&
            coinLeft <= playerRight &&
            updatedY <= 100
          ) {
            const pointValue =
              coin.type === "gold" ? 10 : coin.type === "silver" ? 5 : 20;
            setScore((prevScore) => prevScore + pointValue);

            setCoinCollected(coin.id);
            setTimeout(() => setCoinCollected(null), 300);

            return { ...coin, y: 200 };
          }

          return { ...coin, y: updatedY };
        });

        return updatedCoins.filter((coin) => coin.y < 105);
      });

      requestRef.current = requestAnimationFrame(updateGameState);
    };

    requestRef.current = requestAnimationFrame(updateGameState);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [
    gameStarted,
    gameOver,
    lastCoinTime,
    gameSpeed,
    playerPosition,
    level,
    timeRemaining,
  ]);

  const getCoinEmoji = (type: string) => {
    switch (type) {
      case "gold":
        return "💰";
      case "silver":
        return "🪙";
      case "diamond":
        return "💎";
      default:
        return "💰";
    }
  };

  const getCoinClass = (type: string) => {
    switch (type) {
      case "gold":
        return "coin-gold";
      case "silver":
        return "coin-silver";
      case "diamond":
        return "coin-diamond";
      default:
        return "coin-gold";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getThemeClasses = () => {
    if (theme === "dark") {
      return {
        bgMain: "bg-zinc-950",
        bgSecondary: "bg-zinc-900",
        bgAccent: "bg-violet-600 hover:bg-violet-700",
        bgCard: "bg-zinc-900/50",
        bgGradient: "bg-gradient-to-br from-violet-950 to-zinc-950",
        textMain: "text-zinc-100",
        textSecondary: "text-zinc-300",
        border: "border-zinc-800",
        stats: "bg-zinc-900/80 backdrop-blur-sm border-zinc-800",
        buttonPrimary: "bg-violet-600 hover:bg-violet-700 active:bg-violet-800",
        buttonSecondary: "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700",
      };
    } else {
      return {
        bgMain: "bg-gray-50",
        bgSecondary: "bg-white",
        bgAccent: "bg-violet-600 hover:bg-violet-700",
        bgCard: "bg-white/80",
        bgGradient: "bg-gradient-to-br from-violet-50 to-gray-50",
        textMain: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-gray-200",
        stats: "bg-white/80 backdrop-blur-sm border-gray-200",
        buttonPrimary: "bg-violet-600 hover:bg-violet-700 active:bg-violet-800",
        buttonSecondary: "bg-gray-200 hover:bg-gray-300 active:bg-gray-400",
      };
    }
  };

  const themeColors = getThemeClasses();

  return (
    <div
      className={`${poppins.variable} ${spaceGrotesk.variable} font-sans ${themeColors.bgMain} ${themeColors.textMain} min-h-screen`}
    >
      <div className="fixed inset-0 z-0 opacity-50">
        <div className={`absolute inset-0 ${themeColors.bgGradient}`}></div>
        <div className="absolute top-0 right-0 w-3/4 h-64 bg-violet-600 rounded-bl-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-40 bg-violet-500 rounded-tr-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 min-h-screen flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold font-space tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Coin Catcher
            </span>
          </h1>

          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                : "bg-white text-gray-800 hover:bg-gray-100"
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 shadow-sm`}
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

        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Level", value: level },
            { label: "Score", value: score },
            {
              label: "Time",
              value: formatTime(timeRemaining),
              highlight: gameStarted && timeRemaining <= 10,
            },
            { label: "Best", value: highScore },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${
                themeColors.stats
              } text-center p-2.5 rounded-lg backdrop-blur-sm shadow-xl border ${
                stat.highlight ? "animate-pulse text-red-500" : ""
              } transform transition-all hover:scale-105 duration-200`}
            >
              <p className="text-xs uppercase tracking-wider font-semibold opacity-70">
                {stat.label}
              </p>
              <p className="text-xl font-space font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div
          ref={gameAreaRef}
          className={`flex-1 relative w-full rounded-2xl overflow-hidden shadow-lg border ${
            themeColors.border
          } mb-4 ${
            gameStarted && !gameOver ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <div
              className={`absolute inset-0 ${
                theme === "dark" ? "opacity-5" : "opacity-5"
              }`}
            >
              <div className="grid-pattern"></div>
            </div>
          </div>

          {gameStarted ? (
            <>
              <div
                ref={playerRef}
                className={`absolute z-10 ${
                  theme === "dark"
                    ? "bg-gradient-to-b from-violet-500 to-violet-800"
                    : "bg-gradient-to-b from-violet-500 to-violet-700"
                } rounded-full shadow-lg ${
                  isPlayerMoving
                    ? moveDirection === "left"
                      ? "player-tilt-left"
                      : "player-tilt-right"
                    : ""
                } cursor-grab active:cursor-grabbing`}
                style={{
                  left: `${playerPosition}%`,
                  bottom: "10%",
                  width: `${playerWidth / 10}%`,
                  height: `${playerHeight / 10}%`,
                  transition: isDragging
                    ? "transform 0.1s ease-out"
                    : "transform 0.1s ease-out, left 0.2s ease-out",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDragging(true);
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-lg relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full player-glow"></div>
                    <div className="text-white text-2xl">🧙</div>
                  </div>
                </div>
              </div>

              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className={`absolute z-20 ${getCoinClass(
                    coin.type
                  )} rounded-full shadow-md ${
                    coinCollected === coin.id ? "scale-150 opacity-0" : ""
                  }`}
                  style={{
                    left: `${coin.x}%`,
                    top: `${coin.y}%`,
                    width: `${coinSize / 10}%`,
                    height: `${coinSize / 10}%`,
                    transition:
                      coinCollected === coin.id
                        ? "transform 0.3s ease-out, opacity 0.3s ease-out"
                        : "",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {getCoinEmoji(coin.type)}
                  </div>
                </div>
              ))}

              {showLevelUp && (
                <div className="absolute z-30 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-level-up">
                  <div className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold text-center shadow-lg">
                    <div className="text-lg">Level Up!</div>
                    <div className="text-3xl font-space">{level}</div>
                  </div>
                </div>
              )}

              <div
                className={`absolute top-4 left-4 ${
                  themeColors.stats
                } px-3 py-1.5 rounded-full text-sm shadow-lg ${
                  timeRemaining <= 10 ? "animate-pulse text-red-500" : ""
                }`}
              >
                <p className="flex items-center font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatTime(timeRemaining)}
                </p>
              </div>

              <button
                onClick={resetGame}
                className={`absolute top-4 right-4 ${themeColors.stats} px-3 py-1.5 rounded-full text-sm shadow-lg hover:bg-opacity-90 transition-all`}
              >
                <p className="flex items-center font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset
                </p>
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`max-w-md w-11/12 sm:w-4/5 p-8 rounded-2xl shadow-2xl ${themeColors.bgCard} backdrop-blur-md border ${themeColors.border}`}
              >
                <h2 className="text-3xl font-bold mb-6 text-center font-space bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Coin Catcher
                </h2>

                <div className="relative py-8 flex justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-xl blur-md"></div>
                  <div className="grid grid-cols-3 gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2 animated-coin">💰</div>
                      <div className="font-medium text-sm">10 pts</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2 animated-coin animation-delay-300">
                        🪙
                      </div>
                      <div className="font-medium text-sm">5 pts</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-2 animated-coin animation-delay-600">
                        💎
                      </div>
                      <div className="font-medium text-sm">20 pts</div>
                    </div>
                  </div>
                </div>

                <p className="mb-6 text-center">
                  Catch falling treasures! You have{" "}
                  <span className="font-bold">60 seconds</span> to collect as
                  many coins as possible.
                </p>

                <button
                  onClick={startGame}
                  className={`${themeColors.buttonPrimary} w-full text-white py-3 px-6 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg transform hover:translate-y-1`}
                >
                  Start Game
                </button>

                {highScore > 0 && (
                  <p className="mt-4 text-sm font-medium text-center">
                    High Score: <span className="font-bold">{highScore}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-all z-30">
              <div
                className={`max-w-md w-11/12 sm:w-4/5 p-6 rounded-2xl shadow-xl ${themeColors.bgCard} backdrop-blur-md border ${themeColors.border} scale-in`}
              >
                <h2 className="text-2xl font-bold mb-4 text-center font-space bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  Time&apos;s Up!
                </h2>

                <div className="flex justify-center mb-5">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ping-slow"></div>
                    <div className="relative flex items-center justify-center w-full h-full text-3xl">
                      ⏱️
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div
                    className={`text-center p-4 rounded-xl ${themeColors.bgSecondary} shadow-md`}
                  >
                    <p className="text-xs uppercase font-semibold tracking-wider opacity-70">
                      Final Score
                    </p>
                    <p className="font-bold text-3xl font-space">{score}</p>
                  </div>
                  <div
                    className={`text-center p-4 rounded-xl ${themeColors.bgSecondary} shadow-md`}
                  >
                    <p className="text-xs uppercase font-semibold tracking-wider opacity-70">
                      Level Reached
                    </p>
                    <p className="font-bold text-3xl font-space">{level}</p>
                  </div>
                </div>

                {score >= highScore && (
                  <div className="bg-violet-600 p-3 rounded-xl mb-6 text-white animate-pulse-slow">
                    <p className="font-bold flex items-center justify-center">
                      <span className="text-xl mr-2">🏆</span> New High Score!
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={startGame}
                    className={`${themeColors.buttonPrimary} flex-1 text-white py-3 px-4 rounded-xl font-semibold shadow-md flex items-center justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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

                  <button
                    onClick={resetGame}
                    className={`${themeColors.buttonSecondary} flex-1 py-3 px-4 rounded-xl font-semibold shadow-lg flex items-center justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:hidden mt-1 relative z-10 w-full">
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (gameStarted && !gameOver) {
                    setMoveDirection("left");
                    setIsPlayerMoving(true);
                    setPlayerPosition((prev) => Math.max(prev - 5, 0));
                    setTimeout(() => setIsPlayerMoving(false), 200);
                  }
                }}
                className={`${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600"
                    : "bg-white hover:bg-gray-100 active:bg-gray-200"
                } p-4 rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none`}
                aria-label="Move left"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (gameStarted && !gameOver) {
                    setMoveDirection("right");
                    setIsPlayerMoving(true);
                    setPlayerPosition((prev) =>
                      Math.min(prev + 5, gameWidth - playerWidth / 10)
                    );
                    setTimeout(() => setIsPlayerMoving(false), 200);
                  }
                }}
                className={`${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600"
                    : "bg-white hover:bg-gray-100 active:bg-gray-200"
                } p-4 rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none`}
                aria-label="Move right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {gameStarted && !gameOver && (
              <button
                onClick={resetGame}
                className={`${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                } p-3 rounded-xl shadow-md text-sm font-medium transition-all duration-200`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex justify-center mt-3">
            <span
              className={`${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              } text-xs flex items-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Touch and drag the catcher or use buttons
            </span>
          </div>
        </div>

        <div className="hidden md:flex justify-center mt-1">
          <span
            className={`${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            } text-sm flex items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Use arrow keys, A/D keys, or click and drag to move the character
          </span>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-4 text-center">
          <p
            className={`text-xs ${
              theme === "dark" ? "text-zinc-600" : "text-gray-400"
            }`}
          >
            © 2025 Coin Catcher Game
          </p>
        </footer>
      </div>

      <style jsx>{`
        .font-sans {
          font-family: var(--font-poppins), system-ui, -apple-system, sans-serif;
        }

        .font-space {
          font-family: var(--font-space), monospace;
        }

        .grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(160, 160, 160, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(160, 160, 160, 0.05) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          width: 100%;
          height: 100%;
        }

        /* Coin Styles */
        .coin-gold {
          background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
          animation: coinFloating 2s ease-in-out infinite alternate;
        }

        .coin-silver {
          background: linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 100%);
          box-shadow: 0 0 10px rgba(224, 224, 224, 0.6);
          animation: coinFloating 2.5s ease-in-out infinite alternate;
        }

        .coin-diamond {
          background: linear-gradient(135deg, #a8d8fd 0%, #7bb2ff 100%);
          box-shadow: 0 0 15px rgba(123, 178, 255, 0.7);
          animation: coinFloating 1.8s ease-in-out infinite alternate;
        }

        /* Player Glow Effect */
        .player-glow {
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.6) 0%,
            rgba(139, 92, 246, 0) 70%
          );
          animation: pulse 2s infinite;
        }

        /* Player Tilt Animations */
        .player-tilt-left {
          transform: rotate(-10deg);
        }

        .player-tilt-right {
          transform: rotate(10deg);
        }

        /* Animation Delays */
        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        /* Pulse Animation for Timer */
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-slow {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Coin Floating Animation */
        @keyframes coinFloating {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-5px) rotate(10deg);
          }
        }

        /* Level Up Animation */
        @keyframes levelUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .animate-level-up {
          animation: levelUp 2s ease-in-out forwards;
        }

        /* Animated Coin on Start Screen */
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        .animated-coin {
          animation: bounce 2s ease-in-out infinite;
          display: inline-block;
        }

        /* Game Over Scale In Animation */
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        /* Slow ping animation */
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
