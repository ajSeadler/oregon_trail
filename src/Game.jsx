import React, { useState, useEffect } from 'react';


const Game = () => {
  const [gameState, setGameState] = useState({
    distance: 1000,
    food: 100,
    health: 100,
    money: 200,
    gameOver: false,
    gameWon: false,
    gameStarted: false, // Track if the game has started
  });

  const [showInjuryModal, setShowInjuryModal] = useState(false);

  useEffect(() => {
    let gameLoop;
    if (gameState.gameStarted) {
      gameLoop = setInterval(() => {
        if (!gameState.gameOver && !gameState.gameWon) {
          // Update game state
          const { distance, food, health, money } = gameState;
          const newDistance = distance - 10;
          const newFood = food - 2;
          const newHealth = health - 1;

          if (newFood <= 0 || newHealth <= 0) {
            setGameState({ ...gameState, gameOver: true });
            clearInterval(gameLoop);
          } else if (newDistance <= 0) {
            setGameState({ ...gameState, gameWon: true, distance: 0 });
            clearInterval(gameLoop);
          } else {
            setGameState({
              ...gameState,
              distance: newDistance,
              food: newFood,
              health: newHealth,
            });
          }
        }
      }, 10000);
    }

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const hunt = () => {
    // Player hunts for food with a chance of injury
    const chanceOfInjury = Math.random();
    if (chanceOfInjury < 0.3) {
      const newHealth = gameState.health - 10;
      setGameState({ ...gameState, health: newHealth });
      setShowInjuryModal(true);
    } else {
      const foodFound = Math.floor(Math.random() * 10) + 1;
      setGameState({ ...gameState, food: gameState.food + foodFound });
    }
  };

  const closeModal = () => {
    setShowInjuryModal(false);
  };

  const trade = () => {
    // Player trades goods for money
    const moneyGained = Math.floor(Math.random() * 50) + 1;
    setGameState({ ...gameState, money: gameState.money + moneyGained });
  };

  const eat = () => {
    // Player eats to restore health and consume food
    const newFood = gameState.food - 2;
    const newHealth = Math.min(100, gameState.health + 2); // Ensure health doesn't exceed 100
    setGameState({ ...gameState, food: newFood, health: newHealth });
  };

  const travel = () => {
    // Player travels with a chance of being attacked by a wild animal
    const chanceOfAttack = Math.random();
    if (chanceOfAttack < 0.3) {
      const newHealth = gameState.health - 10;
      setGameState({ ...gameState, health: newHealth });
      setShowInjuryModal(true);
    } else {
      const newDistance = gameState.distance - 50;
      setGameState({ ...gameState, distance: newDistance });
    }
  };

  const startGame = () => {
    setGameState({ ...gameState, gameStarted: true });
  };

  return (
    <div className="game">
      <div className="status">
        <p>Distance to Go: {gameState.distance}</p>
        <p>Food: {gameState.food}</p>
        <p>Health: {gameState.health}</p>
        <p>Money: {gameState.money}</p>
        {gameState.gameOver && <p className="game-over">Game Over</p>}
        {gameState.gameWon && <p className="game-won">You Won!</p>}
      </div>
      { !gameState.gameStarted && <button onClick={startGame} style={{margin:'5%'}}>Start Game</button> }
      {gameState.gameStarted && (
        <div className="actions">
          <button onClick={hunt}>Hunt for Food</button>
          <button onClick={trade}>Trade Goods</button>
          <button onClick={eat}>Eat</button>
          <button onClick={travel}>Travel</button>
        </div>
      )}
      {showInjuryModal && (
        <div className="modal">
          <div className="modal-content">
            <p>You were attacked by a wild animal! (-10 HP)</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
