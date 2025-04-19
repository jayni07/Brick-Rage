import React from "react";

interface CoinProps {
  coin: { id: number; x: number; y: number; type: string };
  coinSize: number;
  coinCollected: number | null;
  getCoinEmoji: (type: string) => string;
  getCoinClass: (type: string) => string;
}

const Coin: React.FC<CoinProps> = ({
  coin,
  coinSize,
  coinCollected,
  getCoinEmoji,
  getCoinClass,
}) => {
  return (
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
  );
};

export default Coin;
