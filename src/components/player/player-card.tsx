import Image from "next/image";
import React from "react";

export type Player = {
  name: string;
  avatar: string;
};

export type T_PlayerCardProps = {
  player: Player;
};

function PlayerCard({ player }: T_PlayerCardProps) {
  return (
    <div className="w-full p-5 bg-neutral-800 rounded-lg flex items-center gap-3">
      <div className="size-8 md:size-10 relative">
        <Image
          src={player.avatar}
          alt={player.name}
          fill
          className="rounded-full object-contain"
        />
      </div>
      <h1 className="text-lg md:text-xl font-bold">{player.name}</h1>
    </div>
  );
}

export default PlayerCard;
