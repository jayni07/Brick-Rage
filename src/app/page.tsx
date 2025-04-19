"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Poppins, Space_Grotesk } from "next/font/google";
import Header from "../components/Header";
import StatsDisplay from "../components/StatsDisplay";
import GameArea from "../components/GameArea";
import StartScreen from "../components/StartScreen";
import GameOverScreen from "../components/GameOverScreen";
import Footer from "../components/Footer";
import ThemeStyles from "../components/ThemeStyles";
import PauseScreen from "../components/PauseScreen";

/* eslint-disable @typescript-eslint/no-unused-vars */

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

interface LevelConfig {
  rows: number;
  cols: number;
  layout?: (row: number, col: number) => boolean;
  ballSpeedMultiplier: number;
  brickOffsetLeftPercent: number;
}

const PADDLE_WIDTH_PERCENT = 15;
const PADDLE_HEIGHT_PERCENT = 2;
const BALL_RADIUS_PERCENT = 1.5;
const BRICK_WIDTH_PERCENT = 10;
const BRICK_HEIGHT_PERCENT = 4;
const BRICK_PADDING_PERCENT = 1;
const BRICK_OFFSET_TOP_PERCENT = 10;
const INITIAL_LIVES = 3;
const BASE_BALL_SPEED = 0.7;

const calculateOffsetLeft = (cols: number): number => {
  return (
    (100 -
      cols * (BRICK_WIDTH_PERCENT + BRICK_PADDING_PERCENT) +
      BRICK_PADDING_PERCENT) /
    2
  );
};

const levelConfigs: LevelConfig[] = [
  {
    rows: 5,
    cols: 8,
    ballSpeedMultiplier: 1.0,
    brickOffsetLeftPercent: calculateOffsetLeft(8),
  },
  {
    rows: 6,
    cols: 9,
    layout: (r, c) => (r + c) % 2 === 0,
    ballSpeedMultiplier: 1.2,
    brickOffsetLeftPercent: calculateOffsetLeft(9),
  },
  {
    rows: 7,
    cols: 10,
    layout: (r, c) => r < 2 || r > 4,
    ballSpeedMultiplier: 1.4,
    brickOffsetLeftPercent: calculateOffsetLeft(10),
  },
  {
    rows: 6,
    cols: 11,
    layout: (r, c) => Math.abs(c - 5) <= r,
    ballSpeedMultiplier: 1.6,
    brickOffsetLeftPercent: calculateOffsetLeft(11),
  },
];

const MAX_LEVEL = levelConfigs.length;

export default function BrickRageGame() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState(
    50 - PADDLE_WIDTH_PERCENT / 2
  );
  const [bricks, setBricks] = useState<BrickData[]>([]);
  const [ball, setBall] = useState<BallData>({
    x: 50,
    y: 50,
    radius: BALL_RADIUS_PERCENT,
    dx: 0,
    dy: 0,
  });
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const paddleWidth = PADDLE_WIDTH_PERCENT;
  const paddleHeight = PADDLE_HEIGHT_PERCENT;
  const gameWidth = 100;
  const gameHeight = 100;

  const [gameOver, setGameOver] = useState(false);
  const [didWin, setDidWin] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brickRageHighScore");
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  });

  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [moveDirection, setMoveDirection] = useState("none");
  const [isPaused, setIsPaused] = useState(false);
  const [pausedDueToLifeLoss, setPausedDueToLifeLoss] = useState(false);
  const [pausedForLevelChange, setPausedForLevelChange] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const initializeBricks = useCallback((currentLevel: number) => {
    const config = levelConfigs[currentLevel - 1];
    if (!config) return;

    const newBricks: BrickData[] = [];
    let brickId = 0;
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const shouldCreateBrick = config.layout ? config.layout(r, c) : true;

        if (shouldCreateBrick) {
          const brickX =
            config.brickOffsetLeftPercent +
            c * (BRICK_WIDTH_PERCENT + BRICK_PADDING_PERCENT);
          const brickY =
            BRICK_OFFSET_TOP_PERCENT +
            r * (BRICK_HEIGHT_PERCENT + BRICK_PADDING_PERCENT);
          newBricks.push({
            id: brickId++,
            x: brickX,
            y: brickY,
            width: BRICK_WIDTH_PERCENT,
            height: BRICK_HEIGHT_PERCENT,
            active: true,
          });
        }
      }
    }
    setBricks(newBricks);
  }, []);

  const resetBall = useCallback(
    (currentLevel: number) => {
      const config = levelConfigs[currentLevel - 1];
      const speedMultiplier = config ? config.ballSpeedMultiplier : 1.0;
      const currentSpeed = BASE_BALL_SPEED * speedMultiplier;

      setBall({
        x: 50,
        y: 70,
        radius: BALL_RADIUS_PERCENT,
        dx: currentSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: -currentSpeed,
      });
      setPlayerPosition(50 - paddleWidth / 2);
    },
    [paddleWidth]
  );

  const startGame = useCallback(() => {
    const startLevel = 1;
    setGameStarted(true);
    setGameOver(false);
    setDidWin(false);
    setScore(0);
    setLevel(startLevel);
    setLives(INITIAL_LIVES);
    initializeBricks(startLevel);
    resetBall(startLevel);
    setIsPaused(false);
    setPausedDueToLifeLoss(false);
    setPausedForLevelChange(false);
  }, [initializeBricks, resetBall]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setDidWin(false);
    setScore(0);
    setLevel(1);
    setLives(INITIAL_LIVES);
    setBricks([]);
    setBall({
      x: 50,
      y: 50,
      radius: BALL_RADIUS_PERCENT,
      dx: 0,
      dy: 0,
    });
    setPlayerPosition(50 - paddleWidth / 2);
    setIsPaused(false);
    setPausedDueToLifeLoss(false);
    setPausedForLevelChange(false);

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, [paddleWidth]);

  const togglePause = useCallback(() => {
    if (gameOver || !gameStarted || pausedForLevelChange || pausedDueToLifeLoss)
      return;
    setIsPaused((prev) => !prev);
  }, [gameOver, gameStarted, pausedForLevelChange, pausedDueToLifeLoss]);

  const continueGame = useCallback(() => {
    if (pausedDueToLifeLoss) {
      resetBall(level);
    }
    setIsPaused(false);
    setPausedDueToLifeLoss(false);
    setPausedForLevelChange(false);
  }, [pausedDueToLifeLoss, resetBall, level]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver || isPaused || !gameAreaRef.current) return;

    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const mouseX = e.clientX - gameRect.left;
    const gameAreaWidthPixels = gameRect.width;

    const mousePositionPercent = (mouseX / gameAreaWidthPixels) * 100;

    let newPosition = mousePositionPercent - paddleWidth / 2;
    newPosition = Math.max(0, Math.min(newPosition, gameWidth - paddleWidth));

    if (Math.abs(newPosition - playerPosition) > 0.1) {
      if (newPosition < playerPosition) {
        setMoveDirection("left");
      } else {
        setMoveDirection("right");
      }
      setIsPlayerMoving(true);
    } else {
      setIsPlayerMoving(false);
      setMoveDirection("none");
    }

    setPlayerPosition(newPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver || isPaused || !gameAreaRef.current) return;

    const gameRect = gameAreaRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - gameRect.left;
    const gameAreaWidthPixels = gameRect.width;

    const touchPositionPercent = (touchX / gameAreaWidthPixels) * 100;

    let newPosition = touchPositionPercent - paddleWidth / 2;
    newPosition = Math.max(0, Math.min(newPosition, gameWidth - paddleWidth));

    if (Math.abs(newPosition - playerPosition) > 0.1) {
      if (newPosition < playerPosition) {
        setMoveDirection("left");
      } else {
        setMoveDirection("right");
      }
      setIsPlayerMoving(true);
    } else {
      setIsPlayerMoving(false);
      setMoveDirection("none");
    }

    setPlayerPosition(newPosition);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem("brickRageHighScore", score.toString());
      }
    }
  }, [score, highScore]);

  useEffect(() => {
    if (isPaused || pausedForLevelChange) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    if (!gameStarted || gameOver) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    const updateGameState = () => {
      if (isPaused || pausedForLevelChange) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        return;
      }

      const currentBall = { ...ball };
      let currentBricks = [...bricks];
      let currentScore = score;
      let currentLives = lives;
      const currentLevel = level;
      let gameIsOver = false;
      let playerWon = false;
      let shouldPauseForLifeLoss = false;
      let levelCleared = false;

      currentBall.x += currentBall.dx;
      currentBall.y += currentBall.dy;

      if (
        currentBall.x - currentBall.radius < 0 ||
        currentBall.x + currentBall.radius > gameWidth
      ) {
        currentBall.dx *= -1;
        currentBall.x = Math.max(
          currentBall.radius,
          Math.min(currentBall.x, gameWidth - currentBall.radius)
        );
      }
      if (currentBall.y - currentBall.radius < 0) {
        currentBall.dy *= -1;
        currentBall.y = currentBall.radius;
      }

      const paddleTopY = gameHeight - paddleHeight - 5;
      const paddleBottomY = paddleTopY + paddleHeight;
      const paddleLeftX = playerPosition;
      const paddleRightX = playerPosition + paddleWidth;

      if (
        currentBall.y + currentBall.radius > paddleTopY &&
        currentBall.y - currentBall.radius < paddleBottomY &&
        currentBall.x + currentBall.radius > paddleLeftX &&
        currentBall.x - currentBall.radius < paddleRightX
      ) {
        if (currentBall.dy > 0) {
          currentBall.dy *= -1;
          currentBall.y = paddleTopY - currentBall.radius;
        }
      }

      if (currentBall.y + currentBall.radius > gameHeight) {
        currentLives -= 1;
        if (currentLives <= 0) {
          gameIsOver = true;
          playerWon = false;
        } else {
          shouldPauseForLifeLoss = true;
        }
      }

      let activeBricksRemaining = 0;
      currentBricks = currentBricks.map((brick) => {
        if (!brick.active) return brick;

        const ballLeft = currentBall.x - currentBall.radius;
        const ballRight = currentBall.x + currentBall.radius;
        const ballTop = currentBall.y - currentBall.radius;
        const ballBottom = currentBall.y + currentBall.radius;

        const brickLeft = brick.x;
        const brickRight = brick.x + brick.width;
        const brickTop = brick.y;
        const brickBottom = brick.y + brick.height;

        if (
          ballRight > brickLeft &&
          ballLeft < brickRight &&
          ballBottom > brickTop &&
          ballTop < brickBottom
        ) {
          currentScore += 10 * currentLevel;

          const overlapLeft = ballRight - brickLeft;
          const overlapRight = brickRight - ballLeft;
          const overlapTop = ballBottom - brickTop;
          const overlapBottom = brickBottom - ballTop;

          const minOverlapX = Math.min(overlapLeft, overlapRight);
          const minOverlapY = Math.min(overlapTop, overlapBottom);

          if (minOverlapY < minOverlapX) {
            if (
              (currentBall.dy > 0 && ballTop < brickBottom) ||
              (currentBall.dy < 0 && ballBottom > brickTop)
            ) {
              currentBall.dy *= -1;
              currentBall.y += currentBall.dy > 0 ? minOverlapY : -minOverlapY;
            }
          } else {
            if (
              (currentBall.dx > 0 && ballLeft < brickRight) ||
              (currentBall.dx < 0 && ballRight > brickLeft)
            ) {
              currentBall.dx *= -1;
              currentBall.x += currentBall.dx > 0 ? minOverlapX : -minOverlapX;
            }
          }

          return { ...brick, active: false };
        } else {
          activeBricksRemaining++;
          return brick;
        }
      });

      if (activeBricksRemaining === 0 && currentBricks.length > 0) {
        levelCleared = true;
      }

      setBall(currentBall);
      if (JSON.stringify(currentBricks) !== JSON.stringify(bricks)) {
        setBricks(currentBricks);
      }
      if (currentScore !== score) setScore(currentScore);
      if (currentLives !== lives) setLives(currentLives);

      if (gameIsOver) {
        setGameOver(true);
        setDidWin(playerWon);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      } else if (levelCleared) {
        if (currentLevel < MAX_LEVEL) {
          const nextLevel = currentLevel + 1;
          setLevel(nextLevel);
          initializeBricks(nextLevel);
          resetBall(nextLevel);
          setPausedForLevelChange(true);
          setTimeout(() => {
            setPausedForLevelChange(false);
          }, 1500);
        } else {
          setGameOver(true);
          setDidWin(true);
        }
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      } else if (shouldPauseForLifeLoss) {
        setIsPaused(true);
        setPausedDueToLifeLoss(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      } else {
        requestRef.current = requestAnimationFrame(updateGameState);
      }
    };

    if (!isPaused && !pausedForLevelChange) {
      requestRef.current = requestAnimationFrame(updateGameState);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [
    gameStarted,
    gameOver,
    isPaused,
    pausedForLevelChange,
    ball,
    bricks,
    score,
    lives,
    level,
    playerPosition,
    paddleWidth,
    paddleHeight,
    gameWidth,
    gameHeight,
    initializeBricks,
    resetBall,
  ]);

  const getThemeClasses = () => {
    if (theme === "dark") {
      return {
        bgMain: "bg-slate-950",
        bgSecondary: "bg-slate-900",
        bgAccent: "bg-cyan-500 hover:bg-cyan-600",
        bgCard: "bg-slate-800/60 backdrop-blur-lg",
        bgGradient: "bg-gradient-to-br from-slate-950 via-slate-900 to-black",
        textMain: "text-slate-100",
        textSecondary: "text-slate-400",
        border: "border-slate-700",
        stats: "bg-slate-800/70 backdrop-blur-sm border border-slate-700",
        buttonPrimary:
          "bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30",
        buttonSecondary:
          "bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-100 font-medium shadow-md",
        paddleBg:
          "bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-md shadow-cyan-500/50",
        ballBg: "bg-white",
        brickGradient:
          "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600",
        titleGradient: "bg-gradient-to-r from-cyan-400 to-blue-500",
      };
    } else {
      return {
        bgMain: "bg-gray-100",
        bgSecondary: "bg-white",
        bgAccent: "bg-blue-600 hover:bg-blue-700",
        bgCard: "bg-white/80 backdrop-blur-lg",
        bgGradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50",
        textMain: "text-slate-800",
        textSecondary: "text-slate-500",
        border: "border-gray-300",
        stats: "bg-white/70 backdrop-blur-sm border border-gray-200",
        buttonPrimary:
          "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30",
        buttonSecondary:
          "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-slate-700 font-medium shadow-md",
        paddleBg:
          "bg-gradient-to-b from-blue-500 to-blue-700 shadow-md shadow-blue-500/30",
        ballBg: "bg-slate-800",
        brickGradient:
          "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
        titleGradient: "bg-gradient-to-r from-blue-600 to-sky-500",
      };
    }
  };

  const themeColors = getThemeClasses();

  return (
    <div
      className={`${poppins.variable} ${spaceGrotesk.variable} font-sans ${themeColors.bgMain} ${themeColors.textMain} min-h-screen transition-colors duration-300`}
      onTouchMove={handleTouchMove}
    >
      <div className="fixed inset-0 z-0 opacity-70 transition-opacity duration-300">
        <div className={`absolute inset-0 ${themeColors.bgGradient}`}></div>
        <div
          className={`absolute top-0 right-0 w-1/2 h-1/2 ${
            theme === "dark" ? "bg-blue-900/30" : "bg-blue-200/30"
          } rounded-full opacity-30 blur-3xl transition-colors duration-300`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-1/3 h-1/3 ${
            theme === "dark" ? "bg-cyan-900/30" : "bg-sky-200/30"
          } rounded-full opacity-30 blur-3xl transition-colors duration-300`}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 min-h-screen flex flex-col">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          themeColors={themeColors}
        />

        <StatsDisplay
          lives={lives}
          score={score}
          highScore={highScore}
          level={level}
          themeColors={themeColors}
        />

        <div className="flex-1 relative flex flex-col mb-4">
          <GameArea
            gameAreaRef={gameAreaRef as React.RefObject<HTMLDivElement>}
            theme={theme}
            themeColors={themeColors}
            gameStarted={gameStarted}
            gameOver={gameOver}
            isPaused={isPaused || pausedForLevelChange || pausedDueToLifeLoss}
            togglePause={togglePause}
            handleMouseMove={handleMouseMove}
            playerRef={playerRef as React.RefObject<HTMLDivElement>}
            playerPosition={playerPosition}
            paddleWidth={paddleWidth}
            paddleHeight={paddleHeight}
            isPlayerMoving={isPlayerMoving}
            moveDirection={moveDirection}
            bricks={bricks}
            ball={ball}
            resetGame={resetGame}
          />
          {!gameStarted && (
            <StartScreen
              startGame={startGame}
              highScore={highScore}
              themeColors={themeColors}
              theme={theme}
            />
          )}
          {(isPaused || pausedDueToLifeLoss) &&
            !pausedForLevelChange &&
            gameStarted &&
            !gameOver && (
              <PauseScreen
                lives={lives}
                continueGame={continueGame}
                themeColors={themeColors}
              />
            )}
          {pausedForLevelChange && gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
              <div
                className={`${themeColors.bgCard} p-8 rounded-xl shadow-2xl text-center`}
              >
                <h2
                  className={`text-3xl font-bold mb-4 ${themeColors.titleGradient} bg-clip-text text-transparent`}
                >
                  Level {level}
                </h2>
                <p className={`${themeColors.textSecondary} mb-6`}>
                  Get Ready!
                </p>
              </div>
            </div>
          )}
          {gameOver && (
            <GameOverScreen
              score={score}
              highScore={highScore}
              didWin={didWin}
              startGame={startGame}
              resetGame={resetGame}
              themeColors={themeColors}
            />
          )}
        </div>

        <div className="hidden md:flex justify-center mt-2">
          <span
            className={`${themeColors.textSecondary} text-sm flex items-center`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.06 18.94l-1.82-1.82m-1.5-1.5L10.5 14.4m-1.5-1.5L7.18 11.06m-1.5-1.5L4.06 7.94m1.5-1.5L7.18 4.82m1.5-1.5L10.5 1.82m1.5 1.5l1.82 1.82m1.5 1.5L16.82 7.94m1.5 1.5L19.94 11.06m-1.5 1.5L16.82 14.4m-1.5 1.5l-1.82 1.82M12 21a9 9 0 110-18 9 9 0 010 18z"
              />
            </svg>
            Use your mouse to move the paddle
          </span>
        </div>

        <Footer theme={theme} />
      </div>

      <ThemeStyles />
    </div>
  );
}
