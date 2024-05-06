import { useState } from "react";
import Guess from "./Guess";
import { fiveLetterWords } from "../../utils/fiveLetterWords";
import { chooseRandomWord } from "../../utils/fiveLetterWordsArr";
import GameStatus from "./GameStatus";

const InputForms = () => {

    const [wordToday,setWordToday] = useState(chooseRandomWord())

    const [gameState,setGameState] = useState([
        0,-1,-1,-1,-1,-1
    ])

    const [gameStage,setGameStage] = useState(0)

    const [corectPos,setCorrectPos] = useState(new Set())

    const [incorrectPos,setIncorrectPos] = useState(new Set())

    const [notPresent,setNotPresent] = useState(new Set())

    const [guess,setGuess] = useState([
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
        [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}]
    ])

    const [wordIsValid,setWordIsValid] = useState(true)

    const [gameWon,setGameWon] = useState(false)

    const [gameLost,setGameLost] = useState(false)

    function playAgain(){
        //set All States to initial state
        setWordToday(chooseRandomWord())
        setGameState([
            0,-1,-1,-1,-1,-1
        ])
        setGameStage(0)
        setCorrectPos(new Set())
        setIncorrectPos(new Set())
        setNotPresent(new Set())

        setGuess([
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}],
            [{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"},{letter:"",color:"bg-slate-400"}]
        ])

        setWordIsValid(true)
        setGameWon(false)
        setGameLost(false)
    }
    function isValid(word){
        const res = fiveLetterWords.has(word)
        return res
    }
    function isWinner(word){
        return (word===wordToday)
    }
    function calculateGuessStatus(word){
        const guessStatus = [-1,-1,-1,-1,-1]
        const wordTodayArr = wordToday.split("")
        const wordArr = word.split("")
        //create frequency map for actual word
        const letterFreq = new Map()

        wordTodayArr.map((chr)=>{
            if(letterFreq.has(chr)){
                letterFreq.set(chr,letterFreq.get(chr)+1)
            }else{
                letterFreq.set(chr,1)
            }
        })
        //look for correct letters at correct positions
        wordArr.map((x,i)=>{
            if(letterFreq.has(x) && (wordArr[i]===wordTodayArr[i])){
                guessStatus[i] = 1
                letterFreq.set(x,letterFreq.get(x)-1)
            }
            if(letterFreq.get(x)===0){
                letterFreq.delete(x)
            }
        })

        //look for letters in mismatched positions
        wordArr.map((x,i)=>{
            if(guessStatus[i]===-1 && letterFreq.has(x)){
                guessStatus[i] = 0
                letterFreq.set(x,letterFreq.get(x)-1)
            }
            if(letterFreq.get(x)===0){
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
                updatedArray[gameStage] = [...updatedArray[gameStage]];
                updatedArray[gameStage].map((x,i)=>{
                    if(guessStatus[i]===1)
                        x.color='bg-green-600'
                    else if(guessStatus[i]===0)
                        x.color='bg-yellow-600'
                })
                return updatedArray
            }
        )

        //setting the letters in different categories as per the guess
        const wordArr = guessCurr.split("")

        guessStatus.map((x,i)=>{
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
        guessStatus.map((x,i)=>{
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
        guessStatus.map((x,i)=>{
            if(x===-1){
                setNotPresent((prev)=>{
                    const sNew = new Set(prev)
                    sNew.add(wordArr[i])
                    return sNew
                })
            }
        })
    }
    function handleSubmitLast(){
        //merging the current guess's input into one
        const guessCurr = guess[gameStage].reduce((acc,x)=>{return acc = acc+x.letter.toLocaleLowerCase()},"")
        //find logic for the guess state
        const guessStatus = calculateGuessStatus(guessCurr)
        //if current word is valid
        if(isValid(guessCurr)){
            //if current word is a winning guess
            if(isWinner(guessCurr)){   
                //setting the current status
                setCurrentStatus(guessStatus,guessCurr);
                //setting it as a valid word
                setWordIsValid(true)
                //fixing the current state
                setGameState((prev)=>{
                    const updatedArray = [...prev]
                    updatedArray[gameStage]=1
                    return updatedArray
                })
                //setting gameWon to true
                setGameWon(true)
            }
            //if current word is not a winning guess but a valid word
            else{
                //setting the current status
                setCurrentStatus(guessStatus,guessCurr);
                //setting it as a valid word
                setWordIsValid(true)
                //fixing the current state
                setGameState((prev)=>{
                    const updatedArray = [...prev]
                    updatedArray[gameStage]=1
                    return updatedArray
                })
                //game is lost here
                setGameLost(true)
            }
        }
        //if current word is invalid
        else{
            setWordIsValid(false)
        }
    }
    
    function handleSubmit(){
        if(gameStage===5){
            handleSubmitLast()
            return
        }
        //merging the current guess's input into one
        const guessCurr = guess[gameStage].reduce((acc,x)=>{return acc = acc+x.letter.toLocaleLowerCase()},"")
        //find logic for the guess state
        const guessStatus = calculateGuessStatus(guessCurr)
        //if current word is valid
        if(isValid(guessCurr)){
            //if current word is a winning guess
            if(isWinner(guessCurr)){   
                //setting the current status
                setCurrentStatus(guessStatus,guessCurr);
                //setting it as a valid word
                setWordIsValid(true)
                //fixing the current state
                setGameState((prev)=>{
                    const updatedArray = [...prev]
                    updatedArray[gameStage]=1
                    return updatedArray
                })
                //setting gameWon to true
                setGameWon(true)
            }
            //if current word is not a winning guess but a valid word
            else{
                //setting the current status
                setCurrentStatus(guessStatus,guessCurr);
                //setting it as a valid word
                setWordIsValid(true)
                //fixing the current state
                setGameState((prev)=>{
                    const updatedArray = [...prev]
                    updatedArray[gameStage]=1
                    updatedArray[gameStage+1]=0
                    return updatedArray
                })
                //fixing the current stage
                setGameStage((prev)=>prev+1)
            }
        }
        //if current word is invalid
        else{
            setWordIsValid(false)
        }
    }

    return(
        <div className="flex-col">
            <div className="my-4">
               
                {
                    [0,1,2,3,4,5].map((i)=>{
                       return  <Guess key={i} visible={gameState[i]} gameStage={gameStage} guessLetter={guess[i]} setGuess={setGuess} />
                    })
                }
            </div>

            <div className="flex-col justify-center gap-2">
                {   
                    gameWon && 
                    <div className="flex justify-center my-2">
                        
                            <h1 className="font-extrabold text-2xl text-green-600 shadow-green-400">You Win</h1>
                        
                    </div>
                }
                {
                    gameLost && 
                    <div className="flex justify-center my-2">
                        {   
                            
                            <h1 className="capitalize font-extrabold text-2xl text-red-600 shadow-red-400">You Lose. Correct Answer Is {wordToday}.</h1>
                        }
                    </div>
                }
                <div className="flex justify-center gap-2">
                    <div>
                        <button className="w-40 h-10 text-white bg-green-400 shadow-lg rounded-md" onClick={handleSubmit}>GUESS</button>
                    </div>
                    <div>
                        <button hidden={gameWon===false && gameLost===false} className="w-[100px] h-10 text-white bg-slate-700 shadow-lg rounded-md" onClick={playAgain}>Play Again</button>
                    </div>
                </div>
                <div className="flex justify-center my-2">
                    <h2 hidden={wordIsValid===true} className="text-red-500 bg-white">word does not exist</h2>
                </div>
                <div className="flex justify-center my-2" > 
                    <GameStatus correctPos={corectPos} incorrectPos={incorrectPos} notPresent={notPresent}/>
                </div>
            </div>
        </div>
    )
}

export default InputForms;