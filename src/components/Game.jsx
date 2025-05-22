import { useState } from "react";
import InputForms from "./InputForms"; // This is the original solo mode component
import OneVsOneMode from "./OneVsOneMode"; // The new 1v1 mode component

const Game = () => {
    const [selectedMode, setSelectedMode] = useState(null); // 'solo', '1v1', or null

    const renderContent = () => {
        if (selectedMode === 'solo') {
            return <InputForms />;
        }
        if (selectedMode === '1v1') {
            return <OneVsOneMode />;
        }
        // If no mode is selected, show selection buttons
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-8">Welcome to Wordle!</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => setSelectedMode('solo')}
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 text-xl"
                    >
                        Play Solo
                    </button>
                    <button
                        onClick={() => setSelectedMode('1v1')}
                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 text-xl"
                    >
                        Play 1 vs 1
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-col min-h-screen">
            {selectedMode && (
                <div className="p-4 flex justify-start">
                    <button
                        onClick={() => setSelectedMode(null)}
                        className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-150"
                    >
                        &larr; Back to Mode Select
                    </button>
                </div>
            )}
            <div className="flex justify-center">
                {/* Rules are only shown if a mode is selected, or could be part of a main page */}
                {selectedMode === 'solo' && (
                     <div className="flex-col items-center">
                        <div className="flex justify-center mt-4">
                            <h1 className="text-3xl font-bold">Wordle - Solo Mode</h1>
                        </div>
                        {renderContent()}
                        <div className="flex justify-center mt-8">
                            <div className="flex-col p-4 border rounded-md shadow-sm bg-gray-50">
                                <h3 className="text-lg font-semibold mb-2">How to Play:</h3>
                                <div className="flex items-center my-2">
                                    <span className="mx-2 w-6 h-6 flex items-center justify-center text-white bg-green-500 border border-gray-400">G</span>
                                    <span>Letter is in the word and in the correct position.</span>
                                </div>
                                <div className="flex items-center my-2">
                                    <span className="mx-2 w-6 h-6 flex items-center justify-center text-white bg-yellow-500 border border-gray-400">Y</span>
                                    <span>Letter is in the word but in the wrong position.</span>
                                </div>
                                <div className="flex items-center my-2">
                                    <span className="mx-2 w-6 h-6 flex items-center justify-center text-white bg-gray-500 border border-gray-400">X</span>
                                    <span>Letter is not in the word.</span>
                                </div>
                                <p className="mt-2">You have 6 tries to guess the 5-letter word.</p>
                            </div>
                        </div>
                    </div>
                )}
                 {selectedMode === '1v1' && (
                    <div className="w-full"> 
                        {/* OneVsOneMode already has its own title */}
                        {renderContent()}
                    </div>
                 )}
                 {selectedMode === null && renderContent()}

            </div>
        </div>
    );
};

export default Game;