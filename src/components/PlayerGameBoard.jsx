import { useState, useEffect } from "react";
import Guess from "./Guess";
import { fiveLetterWords } from "../../utils/fiveLetterWords";
// import { chooseRandomWord } from "../../utils/fiveLetterWordsArr"; // Parent will provide wordToday
import GameStatus from "./GameStatus";

const InputForms = ({ 
    wordToday, 
    isActive, 
    onWin, 
    onLoss, 
    onInvalidWord, 
    onGameEnd, 
    playerIdentifier,
    resetSignal 
}) => {

    const initialGameState = [0,-1,-1,-1,-1,-1];
    const initialGuess = [
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}]
    ];

    const [gameState,setGameState] = useState(initialGameState);
    const [gameStage,setGameStage] = useState(0);
    const [corectPos,setCorrectPos] = useState(new Set());
    const [incorrectPos,setIncorrectPos] = useState(new Set());
    const [notPresent,setNotPresent] = useState(new Set());
    const [guess,setGuess] = useState(initialGuess);
    const [wordIsValid,setWordIsValid] = useState(true);
    const [gameWon,setGameWon] = useState(false);
    const [gameLost,setGameLost] = useState(false);

    useEffect(() => {
        // Reset state when resetSignal changes, but not on initial undefined value
        if (resetSignal !== undefined) {
            setGameState(initialGameState);
            setGameStage(0);
            setCorrectPos(new Set());
            setIncorrectPos(new Set());
            setNotPresent(new Set());
            setGuess(initialGuess);
            setWordIsValid(true);
            setGameWon(false);
            setGameLost(false);
        }
    }, [resetSignal]);


    function isValid(word){
        const res = fiveLetterWords.has(word);
        if (!res && onInvalidWord) {
            onInvalidWord();
        }
        return res;
    }

    function isWinner(word){
        return (word === wordToday);
    }

    function calculateGuessStatus(word){
        const guessStatus = [-1,-1,-1,-1,-1];
        const wordTodayArr = wordToday.split("");
        const wordArr = word.split("");
        //create frequency map for actual word
        const letterFreq = new Map()

        wordTodayArr.forEach((chr)=>{ // Changed from map to forEach for clarity as it's not returning a new array
            if(letterFreq.has(chr)){
                letterFreq.set(chr,letterFreq.get(chr)+1)
            }else{
                letterFreq.set(chr,1)
            }
        })
        //look for correct letters at correct positions
        wordArr.forEach((x,i)=>{ // Changed from map to forEach
            if(letterFreq.has(x) && (wordArr[i]===wordTodayArr[i])){
                guessStatus[i] = 1
                letterFreq.set(x,letterFreq.get(x)-1)
            }
            if(letterFreq.get(x)===0){ // Should be checked after decrementing
                letterFreq.delete(x)
            }
        })

        //look for letters in mismatched positions
        wordArr.forEach((x,i)=>{ // Changed from map to forEach
            if(guessStatus[i]===-1 && letterFreq.has(x) && letterFreq.get(x) > 0){ // Ensure letter is available
                guessStatus[i] = 0
                letterFreq.set(x,letterFreq.get(x)-1)
            }
            if(letterFreq.get(x)===0){ // Should be checked after decrementing
                letterFreq.delete(x)
            }
        })
        return guessStatus;
    }

    function setCurrentStatus(guessStatus,guessCurr){
        //setting the current guess colors before moving on to the next guess
        setGuess(
            (prev)=>{
                const updatedArray = [...prev];
                updatedArray[gameStage] = [...updatedArray[gameStage]]; // This line is redundant, already a copy
                updatedArray[gameStage] = updatedArray[gameStage].map((cell, i) => {
                    if(guessStatus[i]===1)
                        return {...cell, color:'bg-green-600'};
                    else if(guessStatus[i]===0)
                        return {...cell, color:'bg-yellow-600'};
                    return cell;
                });
                return updatedArray;
            }
        )

        //setting the letters in different categories as per the guess
        const wordArr = guessCurr.split("")

        guessStatus.forEach((x,i)=>{ // Changed from map to forEach
            //setting the letters at correct position
            if(x===1){
                if(corectPos.has(wordArr[i])){}
                if(incorrectPos.has(wordArr[i])){
                    setIncorrectPos((prev)=>{
                        const sNew = new Set(prev)
                        sNew.delete(wordArr[i])
                        return sNew
                    })
                    setCorrectPos((prev)=>{
                        const sNew = new Set(prev)
                        sNew.add(wordArr[i])
                        return sNew
                    })
                }
                else{
                    setCorrectPos((prev)=>{
                        const sNew = new Set(prev)
                        sNew.add(wordArr[i])
                        return sNew
                    })
                }
            }
        })
        //setting letters at incorrect positions
        guessStatus.forEach((x,i)=>{ // Changed from map to forEach
            if(x===0){
                if(corectPos.has(wordArr[i]) || incorrectPos.has(wordArr[i])){}
                else{
                    setIncorrectPos((prev)=>{
                        const sNew = new Set(prev)
                        sNew.add(wordArr[i])
                        return sNew
                    })
                }
            }
        })
        //setting letters that are not present in the actual word
        guessStatus.forEach((x,i)=>{ // Changed from map to forEach
            if(x===-1){
                if(!corectPos.has(wordArr[i]) && !incorrectPos.has(wordArr[i])){ // Only add if not already green or yellow
                    setNotPresent((prev)=>{
                        const sNew = new Set(prev)
                        sNew.add(wordArr[i])
                        return sNew
                    })
                }
            }
        })
    }

    function handleSubmitLast(){
        const guessCurr = guess[gameStage].reduce((acc,x)=>{return acc = acc+x.letter.toLocaleLowerCase()},"");
        const guessStatus = calculateGuessStatus(guessCurr);
        
        if(isValid(guessCurr)){
            setCurrentStatus(guessStatus,guessCurr);
            setWordIsValid(true);
            setGameState((prev)=>{
                const updatedArray = [...prev];
                updatedArray[gameStage]=1;
                return updatedArray;
            });

            if(isWinner(guessCurr)){   
                setGameWon(true);
                if (onWin) onWin(gameStage + 1);
                if (onGameEnd) onGameEnd({ won: true, lost: false, attempts: gameStage + 1 });
            } else {
                setGameLost(true);
                if (onLoss) onLoss();
                if (onGameEnd) onGameEnd({ won: false, lost: true, attempts: gameStage + 1 });
            }
        } else {
            setWordIsValid(false);
            // onInvalidWord is called within isValid
        }
    }
    
    function handleSubmit(){
        if (gameWon || gameLost) return; // Don't allow submission if game is over

        if(gameStage===5){
            handleSubmitLast();
            return;
        }
        const guessCurr = guess[gameStage].reduce((acc,x)=>{return acc = acc+x.letter.toLocaleLowerCase()},"");
        const guessStatus = calculateGuessStatus(guessCurr);

        if(isValid(guessCurr)){
            setCurrentStatus(guessStatus,guessCurr);
            setWordIsValid(true);
            setGameState((prev)=>{
                const updatedArray = [...prev];
                updatedArray[gameStage]=1;
                if(gameStage < 5) updatedArray[gameStage+1]=0; // Prepare next line
                return updatedArray;
            });

            if(isWinner(guessCurr)){   
                setGameWon(true);
                if (onWin) onWin(gameStage + 1);
                if (onGameEnd) onGameEnd({ won: true, lost: false, attempts: gameStage + 1 });
            } else {
                setGameStage((prev)=>prev+1);
            }
        } else {
            setWordIsValid(false);
            // onInvalidWord is called within isValid
        }
    }

    return(
        <div className={`flex-col p-4 border-2 rounded-md ${isActive ? 'border-blue-500' : 'border-gray-300 opacity-75'}`}>
            {playerIdentifier && <h2 className="text-xl font-semibold mb-2 text-center">{playerIdentifier}'s Board</h2>}
            <div className="my-4">
                {
                    [0,1,2,3,4,5].map((i)=>{
                       return  <Guess 
                                    key={i} 
                                    visible={gameState[i]} 
                                    gameStage={gameStage} 
                                    guessLetter={guess[i]} 
                                    setGuess={setGuess} 
                                    isRowActive={isActive && gameStage === i && !gameWon && !gameLost} // Pass active state to Guess rows
                                />
                    })
                }
            </div>

            <div className="flex-col justify-center gap-2">
                {   
                    gameWon && 
                    <div className="flex justify-center my-2">
                        <h1 className="font-extrabold text-2xl text-green-600 shadow-green-400">Guessed in {gameStage+1} tries!</h1>
                    </div>
                }
                {
                    gameLost && 
                    <div className="flex justify-center my-2">
                        <h1 className="capitalize font-extrabold text-2xl text-red-600 shadow-red-400">Game Over. Word was: {wordToday}.</h1>
                    </div>
                }
                <div className="flex justify-center gap-2">
                    <div>
                        <button 
                            className="w-40 h-10 text-white bg-green-400 shadow-lg rounded-md disabled:bg-gray-400" 
                            onClick={handleSubmit}
                            disabled={!isActive || gameWon || gameLost}
                        >
                            GUESS
                        </button>
                    </div>
                    {/* "Play Again" button removed, will be handled by parent OneVsOneMode component */}
                </div>
                <div className="flex justify-center my-2">
                    <h2 hidden={wordIsValid===true} className="text-red-500 bg-white p-1 rounded">Word does not exist in dictionary.</h2>
                </div>
                <div className="flex justify-center my-2" > 
                    <GameStatus correctPos={corectPos} incorrectPos={incorrectPos} notPresent={notPresent}/>
                </div>
            </div>
        </div>
    )
}

export default InputForms;