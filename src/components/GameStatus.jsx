import { useEffect, useState } from "react";

const GameStatus = ({correctPos, incorrectPos, notPresent})=>{

    const [correctArray,setCorrectArray] = useState([])
    const [incorrectArray,setIncorrectArray] = useState([])
    const [notPresentArray,setNotPresentArray] = useState([])

    useEffect(()=>{
        setCorrectArray(
            (prev)=>{
                const newArr = []
                correctPos.forEach((f)=>newArr.push(f))
                return newArr
            }
        )
        setIncorrectArray(
            (prev)=>{
                const newArr = []
                incorrectPos.forEach((f)=>newArr.push(f))
                return newArr
            }
        )
        setNotPresentArray(
            (prev)=>{
                const newArr = []
                notPresent.forEach((f)=>newArr.push(f))
                return newArr
            }
        )
    },[correctPos,incorrectPos,notPresent])
    return(
        <div className="w-60">
            <div className="w-60">
                <h1 className="w-60 text-center bg-slate-500 text-white font-bold text-xl rounded-md">Your Guess So Far</h1>
            </div>
            <div className="my-2">
                <div>
                    <h1 className="w-60 text-center bg-green-500 text-white font-bold text-xl rounded-md">Correct Position</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-2 my-2 w-60">
                    {
                        correctArray.map((f,i)=><span key={i} className="p-1 capitalize text-center rounded-md w-8 h-8 text-white bg-green-500">{f}</span>)
                    }
                </div>
            </div>
            <div className="my-2">
                <div>
                    <h1 className="w-60 text-center bg-yellow-500 text-white font-bold text-xl rounded-md">Incorrect Position</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-2 my-2 w-60">
                    {
                        incorrectArray.map((f,i)=><span key={i} className="p-1 capitalize text-center rounded-md w-8 h-8 text-white bg-yellow-500">{f}</span>)
                    }
                </div>
            </div>
            <div className="my-2">
                <div>
                    <h1 className="w-60 text-center bg-red-500 text-white font-bold text-xl rounded-md">Not Present</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-2 my-2 w-60">
                    {
                        notPresentArray.map((f,i)=><span key={i} className="p-1 capitalize text-center rounded-md w-8 h-8 text-white bg-red-500">{f}</span>)
                    }
                </div>
            </div>
        </div>
    )
}

export default GameStatus;