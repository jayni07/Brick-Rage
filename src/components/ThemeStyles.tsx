import React from "react";

const ThemeStyles = () => (
  <style jsx global>{`
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
);

export default ThemeStyles;
