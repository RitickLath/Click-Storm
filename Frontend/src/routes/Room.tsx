import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Room = ({ socket }) => {
  const { roomName, admin } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [arr, setArr] = useState(Array(64).fill("bg-gray-800"));
  const [time, setTime] = useState(0);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState(""); // Store winner message
  const [gameOver, setGameOver] = useState(false); // Flag to control game state

  const colors: [string] = ["bg-red-700", "bg-green-700"];

  useEffect(() => {
    // Timer logic
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev >= 30) {
          clearInterval(interval); // Stop the timer at 30
          setWinner(
            score.player1 > score.player2
              ? "You Won!"
              : score.player1 < score.player2
              ? "You Lose!"
              : "It's a Tie!"
          );
          setGameOver(true); // Set game over once the time is up
          socket.emit("disconnect", { roomName: roomName });

          // Navigate to the home route after 10 seconds
          setTimeout(() => {
            navigate("/");
          }, 10000);

          return 30;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [score, navigate]);

  // Listen for color updates from the backend
  useEffect(() => {
    socket.on("color", (data) => {
      const { color, index } = data;
      setArr((prevArr) => {
        const updatedArr = [...prevArr];
        updatedArr[index] = color;
        return updatedArr;
      });
      setScore({ player1: data.player1, player2: data.player2 });
    });

    return () => {
      socket.off("color"); 
    };
  }, [socket]);

  const handleHit = (index: number) => {
    if (!gameOver) {
      // Only allow hitting if the game is not over
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
