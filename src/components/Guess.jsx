const Guess = ({visible,gameStage,guessLetter,setGuess}) => {
    function handleChange(value,ind){
        
        setGuess(
            (prev)=>{
                const updatedArray = [...prev];
                updatedArray[gameStage] = [...updatedArray[gameStage]];
                updatedArray[gameStage][ind].letter = value;
                return updatedArray
            }
        )
    }
    return (
        <div className="flex justify-center gap-2">
       
            <div hidden={visible===-1} className="flex gap-2">
                <div hidden={visible===-1}  className="my-2">
                    {
                        visible===0 && <input maxLength={1}  className="text-center rounded-md w-8 h-8 bg-slate-700 text-white" value={guessLetter[0].letter} onChange={(e)=>{
                            handleChange(e.target.value,0)
                        }}/> 
                    }
                    {   visible===1 &&
                        <h1 className={`p-1 capitalize text-center rounded-md w-8 h-8 ${guessLetter[0].color}`} >{guessLetter[0].letter}</h1>
                    }
                </div>
                <div hidden={visible===-1}  className="my-2">
                    {
                        visible===0 && <input  maxLength={1}  className="text-center rounded-md w-8 h-8 bg-slate-700  text-white" value={guessLetter[1].letter} onChange={(e)=>{
                            handleChange(e.target.value,1)
                        }}/>
                    }
                    {   
                        visible===1 &&
                        <h1 className={`p-1 capitalize text-center rounded-md w-8 h-8 ${guessLetter[1].color}`} >{guessLetter[1].letter}</h1>
                    }
                </div>
                <div hidden={visible===-1}  className="my-2">
                    {
                        visible===0 && <input maxLength={1}  className="text-center rounded-md w-8 h-8 bg-slate-700  text-white" value={guessLetter[2].letter} onChange={(e)=>{
                            handleChange(e.target.value,2)
                        }}/> 
                    }
                    {
                        visible===1 &&
                        <h1 className={`p-1 capitalize text-center rounded-md w-8 h-8 ${guessLetter[2].color}`} >{guessLetter[2].letter}</h1>
                    }
                </div>
                <div hidden={visible===-1}  className="my-2">
                    {
                        visible===0 && <input  maxLength={1}  className="text-center rounded-md w-8 h-8 bg-slate-700  text-white" value={guessLetter[3].letter} onChange={(e)=>{
                            handleChange(e.target.value,3)
                        }}/> 
                    }
                    {
                        visible===1 &&
                        <h1 className={`p-1 capitalize text-center rounded-md w-8 h-8 ${guessLetter[3].color}`} >{guessLetter[3].letter}</h1>
                    }
                </div>
                <div hidden={visible===-1}  className="my-2">
                    {
                        visible===0 && <input  maxLength={1}  className="text-center rounded-md w-8 h-8 bg-slate-700  text-white" value={guessLetter[4].letter} onChange={(e)=>{
                            handleChange(e.target.value,4)
                        }}/> 
                    }
                    {
                        visible===1 &&   
                        <h1 className={`p-1 capitalize text-center rounded-md w-8 h-8 ${guessLetter[4].color}`} >{guessLetter[4].letter}</h1>
                    }
                </div>
            </div>
        </div>
    )
}

export default Guess