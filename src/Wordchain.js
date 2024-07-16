import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Wordchain.css';

const wordChains = [
  ["mountain", "top", "hat", "trick", "shot"],
  ["butterfly", "net", "worth", "while", "loop"],
  ["telescope", "lens", "cap", "gun", "shot"],
  ["pineapple", "juice", "box", "office", "chair"],
  ["sunflower", "seed", "money", "market", "place"],
  ["rain", "coat", "hanger", "on", "board"],
  ["submarine", "sandwich", "board", "game", "night"],
  ["sky", "light", "house", "boat", "race"],
  ["chocolate", "cake", "walk", "way", "finder"],
  ["hurricane", "lamp", "post", "office", "work"],
  ["book", "store", "front", "door", "bell"],
  ["water", "fall", "back", "pack", "rat"],
  ["space", "ship", "shape", "shift", "work"],
  ["vine", "yard", "stick", "figure", "eight"],
  ["light", "bulb", "moment", "notice", "board"],
  ["volcano", "ash", "tray", "table", "tennis"],
  ["orchestra", "pit", "stop", "watch", "dog"],
  ["fish", "tank", "top", "hat", "trick"],
  ["air", "port", "wine", "glass", "house"],
  ["flower", "bed", "time", "piece", "work"],
  ["moon", "light", "year", "book", "mark"],
  ["sun", "glasses", "case", "study", "hall"],
  ["star", "fish", "bowl", "cut", "throat"],
  ["cloud", "cover", "story", "book", "end"],
  ["river", "bank", "account", "book", "keeper"],
  ["ocean", "wave", "length", "wise", "crack"],
  ["mountain", "peak", "performance", "art", "class"],
  ["desert", "storm", "cloud", "burst", "pipe"],
  ["forest", "fire", "works", "hop", "scotch"],
  ["beach", "ball", "game", "show", "time"],
  ["snow", "ball", "park", "bench", "mark"],
  ["ice", "cream", "cheese", "cake", "walk"],
  ["rock", "star", "dust", "bin", "liner"],
  ["fire", "place", "mat", "finish", "line"],
  ["wind", "mill", "stone", "cold", "shoulder"],
  ["earth", "quake", "proof", "read", "through"],
  ["grass", "roots", "music", "box", "set"],
  ["tree", "trunk", "call", "girl", "friend"],
  ["flower", "power", "nap", "time", "keeper"],
  ["bird", "cage", "fight", "club", "sandwich"],
  ["apple", "pie", "chart", "topper", "most"],
  ["blue", "print", "screen", "test", "drive"],
  ["break", "fast", "food", "chain", "saw"],
  ["cell", "phone", "book", "worm", "hole"],
  ["day", "dream", "catcher", "phrase", "book"],
  ["eye", "ball", "point", "blank", "space"],
  ["foot", "ball", "room", "mate", "ship"],
  ["gold", "fish", "stick", "shift", "key"],
  ["hand", "shake", "down", "town", "hall"],
  ["ink", "well", "being", "human", "nature"],
  ["jump", "rope", "ladder", "step", "son"],
  ["key", "board", "walk", "out", "side"],
  ["lip", "stick", "man", "hole", "punch"],
  ["mail", "box", "car", "pool", "table"],
  ["news", "paper", "clip", "board", "game"],
  ["over", "coat", "rack", "time", "line"],
  ["pen", "knife", "edge", "way", "finder"],
  ["quick", "sand", "castle", "rock", "bottom"],
  ["rain", "bow", "tie", "clip", "art"],
  ["sail", "boat", "house", "keeper", "safe"],
  ["tea", "pot", "luck", "charm", "school"],
  ["under", "ground", "work", "force", "field"],
  ["view", "point", "guard", "rail", "road"],
  ["wall", "paper", "weight", "loss", "leader"],
  ["x-ray", "vision", "board", "walk", "man"],
  ["yard", "sale", "pitch", "fork", "lift"],
  ["zip", "line", "dance", "floor", "mat"],
  ["air", "craft", "work", "shop", "keeper"],
  ["back", "yard", "stick", "insect", "bite"],
  ["car", "port", "hole", "saw", "dust"],
  ["door", "bell", "hop", "scotch", "tape"],
  ["ear", "ring", "leader", "board", "walk"],
  ["face", "book", "end", "game", "over"],
  ["gate", "way", "side", "walk", "man"],
  ["hair", "cut", "throat", "lozenge", "shape"],
  ["ice", "berg", "king", "pin", "ball"],
  ["jam", "jar", "head", "hunter", "gatherer"],
  ["kite", "string", "cheese", "ball", "room"]
];

const generateWordChain = () => {
  return wordChains[Math.floor(Math.random() * wordChains.length)];
};

const Wordchain = () => {
  const [wordChain, setWordChain] = useState(generateWordChain());
  const [board, setBoard] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(1);
  const [hintCount, setHintCount] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [hintsPerRow, setHintsPerRow] = useState([0, 0, 0, 0, 0]);
  const [attemptsAfterLastHint, setAttemptsAfterLastHint] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const initializeBoard = useCallback(() => {
    const newBoard = wordChain.map((word, rowIndex) => {
      return Array(15).fill().map((_, colIndex) => {
        if (colIndex === 0 || rowIndex === 0 || rowIndex === wordChain.length - 1) {
          return { letter: word[colIndex] || '', status: 'revealed', permanent: true };
        }
        return { letter: '', status: 'empty', permanent: false };
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
      if (newBoard[row] && newBoard[row][col] && !newBoard[row][col].permanent) {
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = { ...newBoard[row][col], letter, status: 'filled' };
      }
      return newBoard;
    });
  }, []);

  const checkWord = useCallback(() => {
    if (currentRow === null || !wordChain[currentRow]) return;
    
    const enteredWord = board[currentRow].map(tile => tile.letter).join('').toLowerCase();
    const correctWord = wordChain[currentRow].toLowerCase();
    if (enteredWord === correctWord) {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        newBoard[currentRow] = newBoard[currentRow].map((tile, index) => 
          index < enteredWord.length ? { ...tile, letter: enteredWord[index].toUpperCase(), status: 'correct', permanent: true } : { ...tile, letter: '', status: 'solid', permanent: true }
        );
        return newBoard;
      });
      
      if (currentRow === 3) {
        // If the fourth row is correct, automatically complete the game
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          if (newBoard[4] && wordChain[4]) {
            newBoard[4] = newBoard[4].map((tile, index) => ({
              ...tile,
              letter: (wordChain[4][index] || '').toUpperCase(),
              status: 'correct',
              permanent: true
            }));
          }
          return newBoard;
        });
        setGameEndTime(Date.now());
        setTimeout(() => setShowModal(true), 2000);
      } else {
        setCurrentRow(null);
        setCurrentCol(1);
        setIncorrectAttempts(0);
        setAttemptsAfterLastHint(0);
        setHintsPerRow(prev => {
          const newHints = [...prev];
          newHints[currentRow] = 0;
          return newHints;
        });
      }
    } else {
      setIncorrectAttempts(prev => prev + 1);
      setAttemptsAfterLastHint(prev => prev + 1);
      if (hintsPerRow[currentRow] >= 3) {
        revealWord();
      } else {
        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[currentRow] = newBoard[currentRow].map((tile, index) => 
            tile.permanent ? tile : { ...tile, letter: '', status: 'empty' }
          );
          return newBoard;
        });
        setCurrentCol(1);
      }
    }
  }, [board, currentRow, wordChain, hintsPerRow]);

  const revealWord = useCallback(() => {
    if (currentRow === null || !wordChain[currentRow]) return;
    
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[currentRow] = newBoard[currentRow].map((tile, index) => {
        const letter = wordChain[currentRow] && wordChain[currentRow][index];
        return {
          letter: letter ? letter.toUpperCase() : '',
          status: 'incorrect',
          permanent: true
        };
      });
      return newBoard;
    });
    setGameOver(true);
    setTimeout(() => setShowModal(true), 2000);
  }, [currentRow, wordChain]);

  const giveHint = useCallback(() => {
    if (currentRow === null || !wordChain[currentRow]) return;
    
    if (incorrectAttempts >= 3) {
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        const currentWord = wordChain[currentRow] || '';
        
        // Find the first empty or filled (non-permanent) tile
        const hintIndex = newBoard[currentRow].findIndex((tile, index) => 
          index > 0 && !tile.permanent && (tile.status === 'empty' || tile.status === 'filled')
        );
        
        if (hintIndex !== -1 && hintIndex < currentWord.length) {
          newBoard[currentRow] = newBoard[currentRow].map((tile, index) => {
            if (index === hintIndex) {
              return { 
                letter: currentWord[index].toUpperCase(), 
                status: 'hint',
                permanent: true
              };
            }
            return tile;
          });
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
  }, [incorrectAttempts, currentRow, wordChain]);

  const handleInputChange = useCallback((rowIndex, colIndex, value) => {
    if (board[rowIndex] && board[rowIndex][colIndex] && !board[rowIndex][colIndex].permanent && value.match(/^[a-zA-Z]$/)) {
      updateBoard(rowIndex, colIndex, value.toUpperCase());
      setCurrentRow(rowIndex);
      if (colIndex < 14) {
        setCurrentCol(colIndex + 1);
        const nextInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }, [board, updateBoard]);

  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      checkWord();
    } else if (e.key === 'Backspace' && colIndex > 0 && board[rowIndex] && board[rowIndex][colIndex - 1] && !board[rowIndex][colIndex - 1].permanent) {
      e.preventDefault();
      updateBoard(rowIndex, colIndex - 1, '');
      setCurrentCol(colIndex - 1);
      const prevInput = document.querySelector(`input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }, [checkWord, updateBoard, board]);

  const handleFocus = useCallback((rowIndex, colIndex) => {
    setCurrentRow(rowIndex);
    setCurrentCol(colIndex);
  }, []);

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
    setCurrentRow(null);
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

  const addToRankings = useCallback(() => {
    setShowNameInput(true);
  }, []);

  const submitRanking = useCallback(() => {
    if (playerName) {
      const rankings = JSON.parse(localStorage.getItem('wordchainRankings') || '[]');
      rankings.push({
        name: playerName,
        time: Math.floor((gameEndTime - gameStartTime) / 1000),
        hints: hintCount
      });
      localStorage.setItem('wordchainRankings', JSON.stringify(rankings));
      setShowNameInput(false);
      setShowModal(false);
    }
  }, [playerName, gameEndTime, gameStartTime, hintCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Wordchain</h1>
        <p className="text-sm">{new Date().toLocaleDateString()}</p>
      </div>
      <Link to="/rankings" className="absolute top-4 right-4 text-blue-500 hover:text-blue-700">Rankings</Link>
      <div className="grid grid-cols-15 gap-1 mb-4 max-w-full w-full">
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((tile, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength="1"
                value={tile.letter}
                readOnly={tile.permanent}
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
        className={`mt-4 px-8 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
          incorrectAttempts >= 3 && !gameOver 
            ? 'bg-gray-500 text-white' 
            : 'bg-white border-2 border-black text-black'
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, #9CA3AF ${(incorrectAttempts / 3) * 100}%, transparent ${(incorrectAttempts / 3) * 100}%)`,
        }}
      >
        Hint
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">{gameOver ? "Game Over" : "Amazing!"}</h2>
            {!gameOver && (
              <>
                <p className="text-xl mb-4 text-center">You solved the Wordchain in {Math.floor((gameEndTime - gameStartTime) / 1000)} seconds</p>
                <p className="text-xl mb-6 text-center">You used {hintCount} hints</p>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={addToRankings}
                    className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300"
                  >
                    Add your name to the rankings
                  </button>
                  <button
                    onClick={() => {
                      shareResults();
                      setShowModal(false);
                    }}
                    className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition duration-300"
                  >
                    Share Your Results With Your Favorite Person
                  </button>
                  <button
                    onClick={startNewGame}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
                  >
                    Start New Game
                  </button>
                </div>
              </>
            )}
            {gameOver && (
              <>
                <p className="text-xl mb-6 text-center">You didn't guess the word. Would you like to try again?</p>
                <button
                  onClick={startNewGame}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
                >
                  Start New Game
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Enter Your Name</h2>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full mb-4 text-lg"
              placeholder="Your Name"
            />
            <button
              onClick={submitRanking}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordchain;