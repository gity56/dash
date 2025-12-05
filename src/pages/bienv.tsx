import {type MouseEvent } from 'react';
import Pattern from "../components/bg1"
import Button from "../components/olay"

interface BienvProps {
  onNavigateToGame: (x: number, y: number) => void;
}

function bienvenue({ onNavigateToGame }: BienvProps) {
  const handleButtonClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    onNavigateToGame(x, y);
  };

  return (
    <>
      <Pattern/>
      <div onClick={handleButtonClick}>
        <Button/>
      </div>
    </>
  )
}

export default bienvenue