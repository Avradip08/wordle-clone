import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OneVsOneMode from './OneVsOneMode';
import * as fiveLetterWordsArr from '../../utils/fiveLetterWordsArr'; // To mock chooseRandomWord

// Mock PlayerGameBoard component
jest.mock('./PlayerGameBoard', () => {
    return jest.fn(({ isActive, onGameEnd, playerIdentifier, resetSignal, wordToday }) => {
        // This mock allows tests to simulate game end scenarios
        const simulateGameEnd = (status) => {
            if (isActive) { // Only active boards can end the game
                onGameEnd(status);
            }
        };

        // Expose a way for tests to trigger game end from the mock instance
        // This might be more complex in a real scenario, possibly using data-testid or other selectors
        // For simplicity, we'll imagine a way to trigger this.
        // In a real test, you might find a button within the mocked component or pass a ref.
        
        // For this conceptual test, we'll make it callable via a prop passed to the mock
        // This is not standard, but helps illustrate the test logic without deep implementation
        if (typeof jest.fn().mock.calls === 'object' && jest.fn().mock.calls !== null) {
             // Attach to the mock instance if possible, or use a global/module-level way to trigger
        }


        return (
            <div data-testid={`player-game-board-${playerIdentifier}`} data-active={isActive} data-word={wordToday} data-reset-signal={resetSignal}>
                {playerIdentifier} Board ({isActive ? 'Active' : 'Inactive'})
                {/* Add buttons to simulate win/loss for testing */}
                <button onClick={() => isActive && onGameEnd({ gameWon: true, attempts: 3, completed: true })}>Simulate Win (3 attempts)</button>
                <button onClick={() => isActive && onGameEnd({ gameWon: true, attempts: 5, completed: true })}>Simulate Win (5 attempts)</button>
                <button onClick={() => isActive && onGameEnd({ gameLost: true, attempts: 6, completed: true })}>Simulate Loss</button>
            </div>
        );
    });
});

// Mock chooseRandomWord
jest.mock('../../utils/fiveLetterWordsArr', () => ({
    ...jest.requireActual('../../utils/fiveLetterWordsArr'), // keep other exports
    chooseRandomWord: jest.fn(),
}));

describe('OneVsOneMode Component', () => {
    beforeEach(() => {
        fiveLetterWordsArr.chooseRandomWord.mockReturnValue("APPLE"); // Default mock word
        // Reset mock calls for PlayerGameBoard if needed, though jest.mock usually handles this.
        // PlayerGameBoard.mockClear(); // PlayerGameBoard is the mock constructor
    });

    test('initial render: scores are 0, player 1 turn, no winner message', () => {
        render(<OneVsOneMode />);
        expect(screen.getByText('Player 1 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Current Turn: Player 1')).toBeInTheDocument();
        expect(screen.queryByText(/wins this round/i)).not.toBeInTheDocument(); // No winner message
        expect(screen.queryByText(/The word was:/i)).not.toBeInTheDocument();
    });

    test('turn switching: P1 plays, then P2 plays', () => {
        render(<OneVsOneMode />);
        
        // Player 1's turn
        expect(screen.getByTestId('player-game-board-Player 1')).toHaveAttribute('data-active', 'true');
        expect(screen.getByTestId('player-game-board-Player 2')).toHaveAttribute('data-active', 'false');

        // Simulate Player 1 losing
        const p1Board = screen.getByTestId('player-game-board-Player 1');
        fireEvent.click(screen.getAllByText('Simulate Loss')[0]); // Click loss button in P1's board

        // Now it should be Player 2's turn
        expect(screen.getByText('Current Turn: Player 2')).toBeInTheDocument();
        expect(screen.getByTestId('player-game-board-Player 1')).toHaveAttribute('data-active', 'false');
        expect(screen.getByTestId('player-game-board-Player 2')).toHaveAttribute('data-active', 'true');

        // Simulate Player 2 winning
        const p2Board = screen.getByTestId('player-game-board-Player 2');
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[1]); // P2's win button

        // Match should be over
        expect(screen.getByText('Player 2 wins this round! Player 1 failed.')).toBeInTheDocument();
    });

    test('score and winner: P1 wins, P2 loses', () => {
        render(<OneVsOneMode />);
        
        // P1 wins
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[0]);
        // P2 loses
        fireEvent.click(screen.getAllByText('Simulate Loss')[1]); 
        // Note: The order of clicks matters for which board is active.
        // The above assumes the first button is P1's, second is P2's due to rendering order.
        // This is fragile. A better way is to select within the board.
        // For this example, screen.getAllByText might get buttons from both mocked components.
        // Let's refine selection:
        // const p1BoardControls = within(screen.getByTestId('player-game-board-Player 1'));
        // const p2BoardControls = within(screen.getByTestId('player-game-board-Player 2'));
        // fireEvent.click(p1BoardControls.getByText('Simulate Win (3 attempts)'));
        // fireEvent.click(p2BoardControls.getByText('Simulate Loss'));
        // This would require the mock to be structured to allow `within`. The current simple mock might not.
        // For now, we rely on the order from getAllByText.

        expect(screen.getByText('Player 1 Wins: 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Player 1 wins this round!')).toBeInTheDocument();
        expect(screen.getByText('The word was: APPLE')).toBeInTheDocument();
    });

    test('score and winner: P2 wins (P1 loses, P2 wins with 5 attempts)', () => {
        render(<OneVsOneMode />);
        
        fireEvent.click(screen.getAllByText('Simulate Loss')[0]); // P1 loses
        fireEvent.click(screen.getAllByText('Simulate Win (5 attempts)')[1]); // P2 wins

        expect(screen.getByText('Player 1 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2 wins this round! Player 1 failed.')).toBeInTheDocument();
    });

    test('score and winner: P1 wins by fewer attempts (P1:3, P2:5)', () => {
        render(<OneVsOneMode />);
        
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[0]); // P1 wins in 3
        fireEvent.click(screen.getAllByText('Simulate Win (5 attempts)')[1]); // P2 wins in 5

        expect(screen.getByText('Player 1 Wins: 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Player 1 wins this round by fewer attempts!')).toBeInTheDocument();
    });

    test('score and winner: Tie in attempts (both 3)', () => {
        render(<OneVsOneMode />);
        
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[0]); // P1 wins in 3
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[1]); // P2 wins in 3

        expect(screen.getByText('Player 1 Wins: 0')).toBeInTheDocument(); // No score change for tie
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('This round is a tie! Both guessed in the same number of attempts.')).toBeInTheDocument();
    });

    test('score and winner: Both players lose', () => {
        render(<OneVsOneMode />);
        
        fireEvent.click(screen.getAllByText('Simulate Loss')[0]); // P1 loses
        fireEvent.click(screen.getAllByText('Simulate Loss')[1]); // P2 loses

        expect(screen.getByText('Player 1 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        expect(screen.getByText('This round is a draw! Both players failed to guess the word.')).toBeInTheDocument();
    });

    test('reset match: preserves scores, resets turn and word, resets boards', async () => {
        render(<OneVsOneMode />);
        
        // P1 wins the first round
        fireEvent.click(screen.getAllByText('Simulate Win (3 attempts)')[0]);
        fireEvent.click(screen.getAllByText('Simulate Loss')[1]); 
        expect(screen.getByText('Player 1 Wins: 1')).toBeInTheDocument();

        // Mock for the new word
        fiveLetterWordsArr.chooseRandomWord.mockReturnValue("GRAPE");

        // Click "Play New Match"
        fireEvent.click(screen.getByText('Play New Match'));

        // Scores should be preserved
        expect(screen.getByText('Player 1 Wins: 1')).toBeInTheDocument();
        expect(screen.getByText('Player 2 Wins: 0')).toBeInTheDocument();
        
        // Turn resets to Player 1
        expect(screen.getByText('Current Turn: Player 1')).toBeInTheDocument();
        
        // Winner message and word display should be cleared
        expect(screen.queryByText(/wins this round/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/The word was:/i)).not.toBeInTheDocument();
        
        // Boards should have received new word and reset signal
        // Check one of the boards for the new word and incremented reset signal
        // This relies on the mock structure passing these as data attributes
        const p1Board = screen.getByTestId('player-game-board-Player 1');
        expect(p1Board).toHaveAttribute('data-word', 'GRAPE');
        expect(p1Board).toHaveAttribute('data-reset-signal', '1'); // Initial was 0, incremented to 1

        const p2Board = screen.getByTestId('player-game-board-Player 2');
        expect(p2Board).toHaveAttribute('data-word', 'GRAPE');
        expect(p2Board).toHaveAttribute('data-reset-signal', '1');
    });
});
