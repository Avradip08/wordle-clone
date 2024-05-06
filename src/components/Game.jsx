import InputForms from "./InputForms"

const Game = ()=>{
    
    return (
        <div className="flex-col ">
        {/**input forms */}
        <div className="flex justify-center">
            <h1 className="text-2xl font-bold">Wordle</h1>
        </div>
        <div className="flex justify-center">
            <InputForms/>
        </div>
        {/**submit button */}
        
        {/** Guess State */}
        
        {/**keyboard maybe implemented later */}
        {/**Rules */}
        <div className="flex justify-center">
            <div className="flex-col">
                <div className="flex my-2">
                    <span className="mx-2 w-6 text-green-600 bg-green-600 border-black">{"22"}</span>
                    <span>letter is in the correct position in the word</span>
                </div>
                <div className="flex my-2">
                    <span className="mx-2 w-6 text-yellow-600 bg-yellow-600 border-black">{"22"}</span>
                    <span>letter is not in the correct position in the word</span>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Game