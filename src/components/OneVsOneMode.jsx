import { useState, useEffect } from 'react';
import PlayerGameBoard from './PlayerGameBoard';
import { chooseRandomWord } from '../../utils/fiveLetterWordsArr';

const OneVsOneMode = () => {
    const [wordToday, setWordToday] = useState(chooseRandomWord());
    const [currentPlayer, setCurrentPlayer] = useState(0); // 0 for Player 1, 1 for Player 2
    
    const initialPlayerStatus = {
        attempts: 0,
        gameWon: false,
        gameLost: false,
        completed: false, // True if player has finished their 6 attempts or won/lost
    };

    const [player1Status, setPlayer1Status] = useState({...initialPlayerStatus});
    const [player2Status, setPlayer2Status] = useState({...initialPlayerStatus});

    const [player1MatchWins, setPlayer1MatchWins] = useState(0);
    const [player2MatchWins, setPlayer2MatchWins] = useState(0);

    const [matchOver, setMatchOver] = useState(false);
    const [winnerMessage, setWinnerMessage] = useState('');

    // Signals for resetting child InputForms components
    const [resetSignalP1, setResetSignalP1] = useState(0);
    const [resetSignalP2, setResetSignalP2] = useState(0);

    const switchTurn = () => {
        setCurrentPlayer(prevPlayer => (prevPlayer === 0 ? 1 : 0));
    };

    const determineWinner = () => {
        let p1WonThisMatch = false;
        let p2WonThisMatch = false;

        if (player1Status.gameWon && player2Status.gameWon) {
            if (player1Status.attempts < player2Status.attempts) {
                setWinnerMessage('Player 1 wins this round by fewer attempts!');
                p1WonThisMatch = true;
            } else if (player2Status.attempts < player1Status.attempts) {
                setWinnerMessage('Player 2 wins this round by fewer attempts!');
                p2WonThisMatch = true;
            } else {
                setWinnerMessage("This round is a tie! Both guessed in the same number of attempts.");
            }
        } else if (player1Status.gameWon) {
            setWinnerMessage('Player 1 wins this round!');
            p1WonThisMatch = true;
        } else if (player2Status.gameWon) {
            setWinnerMessage('Player 2 wins this round!');
            p2WonThisMatch = true;
        } else if (player1Status.gameLost && player2Status.gameLost) {
            setWinnerMessage("This round is a draw! Both players failed to guess the word.");
        } else if (player1Status.gameLost) { // Player 1 lost, Player 2 hadn't won (so P2 wins by default if P2 completed)
            setWinnerMessage('Player 2 wins this round! Player 1 failed.');
            if(player2Status.completed) p2WonThisMatch = true; // P2 wins if they completed, even if they also lost but P1 lost "first" or worse
        } else if (player2Status.gameLost) { // Player 2 lost, Player 1 hadn't won
            setWinnerMessage('Player 1 wins this round! Player 2 failed.');
            if(player1Status.completed) p1WonThisMatch = true;
        } else {
            setWinnerMessage('Match ended, but no clear winner for the round.');
        }

        if (p1WonThisMatch) setPlayer1MatchWins(prev => prev + 1);
        if (p2WonThisMatch) setPlayer2MatchWins(prev => prev + 1);
        
        setMatchOver(true);
    };
    
    useEffect(() => {
        if (player1Status.completed && player2Status.completed && !matchOver) {
            determineWinner();
        }
    }, [player1Status, player2Status, matchOver]);


    const handleGameEnd = (playerNum, status) => {
        if (playerNum === 0) {
            setPlayer1Status({ ...status, completed: true });
        } else {
            setPlayer2Status({ ...status, completed: true });
        }

        // If the current player just finished, switch turns immediately
        // unless the other player has also finished.
        if (playerNum === currentPlayer) {
            if (playerNum === 0 && !player2Status.completed) {
                switchTurn();
            } else if (playerNum === 1 && !player1Status.completed) {
                switchTurn();
            }
        }
    };
    
    const handleInvalidWord = (playerNum) => {
        // console.log(`Player ${playerNum + 1} submitted an invalid word.`);
        // Potentially add a message to the UI for the specific player
    };

    const resetMatch = () => {
        setWordToday(chooseRandomWord());
        setPlayer1Status({...initialPlayerStatus});
        setPlayer2Status({...initialPlayerStatus});
        setCurrentPlayer(0);
        setMatchOver(false);
        setWinnerMessage('');
        setResetSignalP1(prev => prev + 1);
        setResetSignalP2(prev => prev + 1);
    };

    return (
        <div className="flex flex-col items-center p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">1 vs 1 Wordle</h1>

            <div className="flex justify-around w-full max-w-md mb-4 text-lg">
                <div className={`p-2 rounded ${currentPlayer === 0 && !matchOver ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    Player 1 Wins: {player1MatchWins}
                </div>
                <div className={`p-2 rounded ${currentPlayer === 1 && !matchOver ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Player 2 Wins: {player2MatchWins}
                </div>
            </div>
            
            {!matchOver && (
                <div className="mb-4 text-xl font-semibold text-gray-700">
                    Current Turn: Player {currentPlayer + 1}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full max-w-4xl">
                <PlayerGameBoard
                    key={`player1-${resetSignalP1}`}
                    wordToday={wordToday}
                    isActive={currentPlayer === 0 && !matchOver && !player1Status.completed}
                    onGameEnd={(status) => handleGameEnd(0, status)}
                    onInvalidWord={() => handleInvalidWord(0)}
                    playerIdentifier="Player 1"
                    resetSignal={resetSignalP1}
                />
                <PlayerGameBoard
                    key={`player2-${resetSignalP2}`}
                    wordToday={wordToday}
                    isActive={currentPlayer === 1 && !matchOver && !player2Status.completed}
                    onGameEnd={(status) => handleGameEnd(1, status)}
                    onInvalidWord={() => handleInvalidWord(1)}
                    playerIdentifier="Player 2"
                    resetSignal={resetSignalP2}
                />
            </div>

            {matchOver && (
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">{winnerMessage}</h2>
                    <p className="text-lg">The word was: <span className="font-semibold">{wordToday}</span></p>
                </div>
            )}

            <button 
                className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                onClick={resetMatch}
            >
                {matchOver ? 'Play New Match' : 'Reset Match'}
            </button>
        </div>
    );
};

export default OneVsOneMode;
