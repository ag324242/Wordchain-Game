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
  const [wordChain] = useState(generateWordChain());
  const [board, setBoard] = useState([]);
  const [currentRow, setCurrentRow] = useState(1);
  const [currentCol, setCurrentCol] = useState(1);
  const [hintCount, setHintCount] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      } else {
        setGameEndTime(Date.now());
        setShowModal(true);
      }
      setIncorrectAttempts(0);
    } else {
      setIncorrectAttempts(prev => prev + 1);
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[currentRow] = newBoard[currentRow].map((tile, index) => 
          index === 0 ? tile : { letter: '', status: 'empty' }
        );
        return newBoard;
      });
      setCurrentCol(1);
    }
  }, [board, currentRow, wordChain]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      checkWord();
    } else if (event.key === 'Backspace') {
      if (currentCol > 1) {
        updateBoard(currentRow, currentCol - 1, '');
        setCurrentCol(prev => prev - 1);
      }
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      if (currentCol < 15) {
        updateBoard(currentRow, currentCol, event.key.toUpperCase());
        setCurrentCol(prev => prev + 1);
      }
    }
  }, [checkWord, currentRow, currentCol, updateBoard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const giveHint = useCallback(() => {
    if (incorrectAttempts >= 3) {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        const currentWord = wordChain[currentRow];
        const emptyTiles = newBoard[currentRow].filter((tile, index) => 
          index > 0 && (tile.status === 'empty' || tile.status === 'filled')
        );
        const hintCount = Math.ceil(emptyTiles.length * 0.33); // 33% of remaining tiles
        
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
      setIncorrectAttempts(0);
    }
  }, [incorrectAttempts, currentRow, wordChain]);

  const handleTouchTile = useCallback((rowIndex, colIndex) => {
    if (rowIndex === currentRow && colIndex >= 1 && colIndex <= 14) {
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

  const VirtualKeyboard = () => {
    const keys = [
      'QWERTYUIOP'.split(''),
      'ASDFGHJKL'.split(''),
      ['Enter', ...'ZXCVBNM'.split(''), 'Backspace']
    ];

    const handleVirtualKeyPress = (key) => {
      if (key === 'Enter') {
        checkWord();
      } else if (key === 'Backspace') {
        if (currentCol > 1) {
          updateBoard(currentRow, currentCol - 1, '');
          setCurrentCol(prev => prev - 1);
        }
      } else if (currentCol < 15) {
        updateBoard(currentRow, currentCol, key);
        setCurrentCol(prev => prev + 1);
      }
    };

    return (
      <div className="virtual-keyboard">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleVirtualKeyPress(key)}
                className="keyboard-key"
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Wordchain</h1>
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
      </div>
      <div className="grid grid-cols-15 gap-1 mb-4 max-w-md w-full">
        {board.map((row, rowIndex) => (
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square flex items-center justify-center border-2 border-gray-300 text-xs sm:text-sm md:text-base font-bold cursor-pointer ${
                tile.status === 'revealed' ? 'bg-blue-200' :
                tile.status === 'correct' ? 'bg-green-300' :
                tile.status === 'hint' ? 'bg-gray-300' :
                tile.status === 'solid' ? 'bg-gray-500' :
                'bg-white'
              }`}
              onClick={() => handleTouchTile(rowIndex, colIndex)}
            >
              {tile.letter}
            </div>
          ))
        ))}
      </div>
      <VirtualKeyboard />
      <button
        onClick={giveHint}
        disabled={incorrectAttempts < 3}
        className={`mt-4 px-8 py-2 rounded-full text-lg font-semibold ${
          incorrectAttempts >= 3 ? 'bg-gray-500 text-white' : 'bg-white border-2 border-black text-black'
        }`}
      >
        Hint
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Amazing!</h2>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordchain;