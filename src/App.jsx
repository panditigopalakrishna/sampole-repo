import React, { useState, useEffect } from 'react'

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)
  const [draws, setDraws] = useState(0)

  useEffect(() => {
    const savedStats = localStorage.getItem('gameStats')
    if (savedStats) {
      const stats = JSON.parse(savedStats)
      setXWins(stats.xWins || 0)
      setOWins(stats.oWins || 0)
      setDraws(stats.draws || 0)
    }
  }, [])

  useEffect(() => {
    if (xWins > 0 || oWins > 0 || draws > 0) {
      localStorage.setItem('gameStats', JSON.stringify({ xWins, oWins, draws }))
    }
  }, [xWins, oWins, draws])

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameWinner === 'X') {
        setXWins(xWins + 1)
      } else {
        setOWins(oWins + 1)
      }
    } else if (newBoard.every(square => square !== null)) {
      setWinner('Draw')
      setDraws(draws + 1)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
  }

  const resetStats = () => {
    setXWins(0)
    setOWins(0)
    setDraws(0)
    localStorage.removeItem('gameStats')
  }

  const renderSquare = (index) => {
    return (
      <button
        className={`square ${board[index] ? `square-${board[index].toLowerCase()}` : ''}`}
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
      >
        {board[index]}
      </button>
    )
  }

  const getStatus = () => {
    if (winner === 'Draw') {
      return "It's a Draw! 🤝"
    }
    if (winner) {
      return `Winner: ${winner} 🎉`
    }
    return `Next Player: ${isXNext ? 'X' : 'O'}`
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🎮 Tic-Tac-Toe</h1>
          <p className="subtitle">Classic game, modern design</p>
        </header>

        <div className="game-stats">
          <div className="stat-card">
            <div className="stat-label">X Wins</div>
            <div className="stat-value">{xWins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">O Wins</div>
            <div className="stat-value">{oWins}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Draws</div>
            <div className="stat-value">{draws}</div>
          </div>
        </div>

        <div className="game-status">{getStatus()}</div>

        <div className="board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>

        <div className="controls">
          <button className="btn btn-primary" onClick={resetGame}>
            New Game
          </button>
          <button className="btn btn-secondary" onClick={resetStats}>
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

