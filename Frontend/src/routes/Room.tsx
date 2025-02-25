import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Room = ({ socket }) => {
  const { roomName, admin } = useParams();
  const navigate = useNavigate();
  const [arr, setArr] = useState(Array(64).fill("bg-gray-800")); // Grid tiles colors
  const [time, setTime] = useState(0); // Timer state
  const [score, setScore] = useState({ player1: 0, player2: 0 }); // Player scores
  const [, setWinner] = useState(""); // Winner message state (not used directly)
  const [gameOver, setGameOver] = useState(false); // Game over state

  const colors: [string] = ["bg-red-700", "bg-green-700"]; // Tile colors

  useEffect(() => {
    // Timer logic - counts down from 30 seconds
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev >= 30) {
          clearInterval(interval); // Stop the timer when 30 seconds is reached
          setWinner(
            score.player1 > score.player2
              ? "You Won!" // If player 1 wins
              : score.player1 < score.player2
              ? "You Lose!" // If player 2 wins
              : "It's a Tie!" // If scores are equal
          );
          setGameOver(true); // End the game

          // Navigate to the home route after 10 seconds to give time to see the result
          setTimeout(() => {
            navigate("/"); // Navigate to the home page
          }, 10000);

          return 30; // Ensure the timer doesn't exceed 30
        }
        return prev + 1; // Increment the timer each second
      });
    }, 1000); // Every 1000ms (1 second)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [score, navigate, socket, roomName]);

  useEffect(() => {
    // Listen for color updates from the backend (when players hit a tile)
    socket.on("color", (data) => {
      const { color, index } = data;
      setArr((prevArr) => {
        const updatedArr = [...prevArr];
        updatedArr[index] = color; // Update the color of the tile that was hit
        return updatedArr;
      });
      setScore({ player1: data.player1, player2: data.player2 }); // Update player scores
    });

    return () => {
      socket.off("color"); // Cleanup the socket listener on component unmount
    };
  }, [socket]);

  const handleHit = (index: number) => {
    if (!gameOver) {
      // Emit the hit event only if the game is not over
      socket.emit("hit", { roomName: roomName, index });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden px-2">
      {/* Winner Message */}
      {gameOver && (
        <div className="text-4xl text-white font-bold py-4">
          {admin === "0" ? (
            <div>
              {score.player1 > score.player2
                ? "You Won!"
                : score.player1 < score.player2
                ? "You Lose!"
                : "It's a Tie!"}
            </div>
          ) : (
            <div>
              {score.player1 < score.player2
                ? "You Won!"
                : score.player1 > score.player2
                ? "You Lose!"
                : "It's a Tie!"}
            </div>
          )}
        </div>
      )}

      {/* Timer and Score Display */}
      <div className="flex space-x-12 mb-8">
        <h1 className="text-3xl text-white font-bold py-4">{time}</h1>
        <h1 className="text-3xl text-white font-bold py-4">{score.player1}</h1>
        <h1 className="text-3xl text-white font-bold py-4">{score.player2}</h1>
      </div>

      {/* Game Grid */}
      <div className="flex flex-wrap space-x-2 space-y-2 justify-center">
        {arr.map((color, index) => (
          <div
            key={index}
            onClick={() => handleHit(index)}
            className={`${color} hover:bg-gray-600 w-20 h-20 md:w-24 md:h-24 rounded-md shadow-md transition-all duration-200 cursor-pointer ${
              gameOver && "cursor-not-allowed"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Room;

/**
 * Room Component - This is the main component for the game room.
 *
 * Basic Flow:
 * 1. **Component Initialization**:
 *    - The component receives a `socket` prop, which is used to communicate with the backend in real-time.
 *    - It also uses the `useParams` hook from `react-router-dom` to extract `roomName` (the unique name of the room) and `admin` (indicating if the current player is the admin or not) from the URL parameters.
 *    - The `navigate` function is obtained from `useNavigate` to programmatically navigate to other routes (e.g., back to the home page after the game ends).
 *
 * 2. **Timer Initialization**:
 *    - A timer is initialized using the `setInterval` method inside a `useEffect`. The timer counts down from 30 seconds.
 *    - As the timer updates every second, the `setTime` function is called to increment the time. When the time reaches 30 seconds, the game ends automatically, and the winner is determined.
 *    - A check occurs to compare the scores of `player1` and `player2` to determine the winner. If the time runs out, the winner is displayed based on the score comparison. The game is then marked as over.
 *
 * 3. **Game Grid**:
 *    - A 64-tile game grid is created with an array of strings, where each string represents the background color of a tile (either "bg-gray-800" or another color).
 *    - The user can interact with this grid by clicking on the tiles, triggering the `handleHit` function.
 *    - The `handleHit` function emits a `hit` event to the backend with the current room name and the index of the clicked tile.
 *
 * 4. **Socket Communication**:
 *    - The component listens for the `color` event from the backend using `socket.on`.
 *    - When the `color` event is received, it updates the tile color and the scores in the game by calling the `setArr` (to update the tile colors) and `setScore` (to update the player scores) functions.
 *    - The event data includes the color for a specific tile and the updated scores for both players.
 *    - The `useEffect` hook ensures that the component subscribes to this event when it mounts and cleans up by unsubscribing when it unmounts using `socket.off`.
 *
 * 5. **Game Over and Result**:
 *    - Once the timer runs out, the game ends, and a result message (either "You Won!", "You Lose!", or "It's a Tie!") is displayed based on the score comparison.
 *    - The `setGameOver` state is set to `true`, preventing any further tile clicks and marking the game as finished.
 *    - The result message changes depending on whether the current player (admin or not) won or lost.
 *
 * 6. **Navigation After Game**:
 *    - After the result is displayed for 10 seconds, the player is redirected back to the home page using the `navigate` function.
 *    - The player is automatically sent back to the home screen to start a new game or create a new room.
 *
 * Additional Functionality:
 * 1. **Game Grid Interactivity**:
 *    - The tiles in the grid can be clicked to send a "hit" event to the backend, triggering updates to the game state (tile colors, scores).
 *    - After the game ends, the tiles become non-interactive (via the `cursor-not-allowed` CSS class).
 *
 * 2. **Score Display**:
 *    - The current score of both players is displayed alongside the countdown timer, allowing the players to track their progress throughout the game.
 *
 * 3. **Real-Time Updates**:
 *    - The game state is updated in real-time based on the backend responses, with the grid colors and player scores being updated as soon as the backend emits the corresponding data.
 */
