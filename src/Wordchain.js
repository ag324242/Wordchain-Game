import React, { useState, useEffect, useCallback } from 'react';
import './Wordchain.css';

const wordChains = [
  ["mountain", "climbing", "equipment", "rental", "service"],
  ["butterfly", "migration", "pattern", "recognition", "software"],
  ["telescope", "discovery", "channel", "surfing", "instructor"],
  ["pineapple", "plantation", "management", "consultant", "meeting"],
  ["sunflower", "seedling", "growth", "hormone", "treatment"],
  ["rainforest", "ecosystem", "balance", "restoration", "project"],
  ["submarine", "exploration", "documentary", "filmmaker", "award"],
  ["skyscraper", "architecture", "design", "competition", "winner"],
  ["chocolate", "fountain", "centerpiece", "arrangement", "service"],
  ["hurricane", "preparedness", "planning", "committee", "meeting"]
];

const generateWordChain = () => {
  return wordChains[Math.floor(Math.random() * wordChains.length)];
};

const Wordchain = () => {
  const [wordChain, setWordChain] = useState(generateWordChain());
  const [board, setBoard] = useState([]);
  const [currentRow, setCurrentRow] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [hintCount, setHintCount] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [hintsPerRow, setHintsPerRow] = useState([0, 0, 0, 0, 0]);
  const [attemptsAfterLastHint, setAttemptsAfterLastHint] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const initializeBoard = useCallback(() => {
    const newBoard = wordChain.map((word, rowIndex) => {
      return Array(15).fill().map((_, colIndex) => {
        if (colIndex === 0 || (rowIndex === 0 || rowIndex === 4)) {
          return { letter: word[colIndex], status: 'revealed' };
        }
        return { letter: '', status: 'empty' };
      });
    });
    setBoard(newBoard);
  }, [wordChain]);

  useEffect(() => {
    initializeBoard();
    setGameStartTime(Date.now());
  }, [initializeBoard]);

  const updateBoard = useCallback((row, col, letter) => {
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[row] = [...newBoard[row]];
      newBoard[row][col] = { letter, status: 'filled' };
      return newBoard;
    });
  }, []);

  const checkWord = useCallback(() => {
    const enteredWord = board[currentRow].map(tile => tile.letter).join('').toLowerCase();
    console.log('Checking word:', enteredWord, 'Correct word:', wordChain[currentRow]);
    if (enteredWord === wordChain[currentRow]) {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[currentRow] = newBoard[currentRow].map((tile, index) => 
          index < enteredWord.length ? { letter: enteredWord[index].toUpperCase(), status: 'correct' } : { letter: '', status: 'solid' }
        );
        return newBoard;
      });
      if (currentRow < 4) {
        setCurrentRow(prev => prev + 1);
        setCurrentCol(1);
        setIncorrectAttempts(0);
        setAttemptsAfterLastHint(0);
        setHintsPerRow(prev => {
          const newHints = [...prev];
          newHints[currentRow] = 0;
          return newHints;
        });
      } else {
        setGameEndTime(Date.now());
        setShowModal(true);
      }
    } else {
      setIncorrectAttempts(prev => prev + 1);
      setAttemptsAfterLastHint(prev => prev + 1);
      console.log('Incorrect attempt. Total:', incorrectAttempts + 1, 'After last hint:', attemptsAfterLastHint + 1);
      if (attemptsAfterLastHint + 1 >= 5 && hintsPerRow[currentRow] >= 3) {
        console.log('Triggering game over');
        revealWord();
      } else {
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[currentRow] = newBoard[currentRow].map((tile, index) => 
            index === 0 ? tile : { letter: '', status: 'empty' }
          );
          return newBoard;
        });
        setCurrentCol(1);
      }
    }
  }, [board, currentRow, wordChain, attemptsAfterLastHint, hintsPerRow, incorrectAttempts]);

  const revealWord = useCallback(() => {
    console.log('Revealing word');
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[currentRow] = newBoard[currentRow].map((tile, index) => ({
        letter: wordChain[currentRow][index].toUpperCase(),
        status: 'incorrect'
      }));
      return newBoard;
    });
    setGameOver(true);
    setShowModal(true);
  }, [currentRow, wordChain]);

  const giveHint = useCallback(() => {
    if (incorrectAttempts >= 3) {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        const currentWord = wordChain[currentRow];
        const emptyTiles = newBoard[currentRow].filter((tile, index) => 
          index > 0 && (tile.status === 'empty' || tile.status === 'filled')
        );
        const hintCount = Math.min(hintsPerRow[currentRow] + 1, Math.ceil(emptyTiles.length * 0.33));
        
        let hintsGiven = 0;
        for (let i = 1; i < 15 && hintsGiven < hintCount; i++) {
          if (newBoard[currentRow][i].status === 'empty' || newBoard[currentRow][i].status === 'filled') {
            newBoard[currentRow][i] = { 
              letter: currentWord[i].toUpperCase(), 
              status: 'hint' 
            };
            hintsGiven++;
          }
        }
        return newBoard;
      });
      setHintCount(prev => prev + 1);
      setHintsPerRow(prev => {
        const newHints = [...prev];
        newHints[currentRow]++;
        return newHints;
      });
      setIncorrectAttempts(0);
      setAttemptsAfterLastHint(0);
    }
  }, [incorrectAttempts, currentRow, wordChain, hintsPerRow]);

  const handleInputChange = useCallback((rowIndex, colIndex, value) => {
    if (rowIndex === currentRow && value.match(/^[a-zA-Z]$/)) {
      updateBoard(rowIndex, colIndex, value.toUpperCase());
      if (colIndex < 14) {
        setCurrentCol(colIndex + 1);
        const nextInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }, [currentRow, updateBoard]);

  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      checkWord();
    } else if (e.key === 'Backspace' && colIndex > 0 && !e.target.value) {
      e.preventDefault();
      updateBoard(rowIndex, colIndex - 1, '');
      setCurrentCol(colIndex - 1);
      const prevInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }, [checkWord, updateBoard]);

  const handleFocus = useCallback((rowIndex, colIndex) => {
    if (rowIndex === currentRow) {
      setCurrentCol(colIndex);
    }
  }, [currentRow]);

  const shareResults = useCallback(() => {
    const timeTaken = Math.floor((gameEndTime - gameStartTime) / 1000);
    const message = `I solved today's Wordchain in ${timeTaken} seconds with ${hintCount} hints!`;
    if (navigator.share) {
      navigator.share({
        title: 'Wordchain Results',
        text: message,
      });
    } else {
      alert(message);
    }
  }, [gameEndTime, gameStartTime, hintCount]);

  const startNewGame = useCallback(() => {
    setWordChain(generateWordChain());
    setBoard([]);
    setCurrentRow(1);
    setCurrentCol(1);
    setHintCount(0);
    setIncorrectAttempts(0);
    setHintsPerRow([0, 0, 0, 0, 0]);
    setAttemptsAfterLastHint(0);
    setGameStartTime(Date.now());
    setGameEndTime(null);
    setShowModal(false);
    setGameOver(false);
    initializeBoard();
  }, [initializeBoard]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Wordchain</h1>
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
      </div>
      <div className="grid grid-cols-15 gap-1 mb-4 max-w-full w-full">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((tile, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength="1"
                value={tile.letter}
                readOnly={tile.status !== 'empty' && tile.status !== 'filled'}
                className={`wordchain-input ${
                  tile.status === 'revealed' ? 'bg-blue-200' :
                  tile.status === 'correct' ? 'bg-green-300' :
                  tile.status === 'hint' ? 'bg-gray-300' :
                  tile.status === 'solid' ? 'bg-gray-500' :
                  tile.status === 'incorrect' ? 'bg-red-500' :
                  'bg-white'
                }`}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onFocus={() => handleFocus(rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={giveHint}
        disabled={incorrectAttempts < 3 || gameOver}
        className={`mt-4 px-8 py-2 rounded-full text-lg font-semibold ${
          incorrectAttempts >= 3 && !gameOver ? 'bg-gray-500 text-white' : 'bg-white border-2 border-black text-black'
        }`}
      >
        Hint
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{gameOver ? "Game Over" : "Amazing!"}</h2>
            {!gameOver && (
              <>
                <p className="text-lg">You solved the Wordchain in {Math.floor((gameEndTime - gameStartTime) / 1000)} seconds</p>
                <p className="text-lg">You used {hintCount} hints</p>
                <button
                  onClick={() => {
                    shareResults();
                    setShowModal(false);
                  }}
                  className="mt-4 bg-black text-white px-6 py-2 rounded-full text-lg font-semibold"
                >
                  Share Your Results
                </button>
              </>
            )}
            {gameOver && (
              <p className="text-lg">You didn't guess the word. Would you like to try again?</p>
            )}
            <button
              onClick={startNewGame}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-lg font-semibold"
            >
              Start New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordchain;