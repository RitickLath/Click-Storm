import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { useParams } from "react-router-dom";

// const socket = io("http://localhost:3000");

const Room = () => {
  //const { RoomId } = useParams();
  const [tile] = useState<number>(64);
  const [time, setTime] = useState<number>(30);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Start countdown timer
    intervalRef.current = window.setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    // Cleanup timer on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (time === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [time]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden px-2">
      {/* Timer Display */}
      <h1 className="text-3xl text-white font-bold py-4">{time}</h1>

      <div className="flex flex-wrap space-x-2 space-y-2 justify-center">
        {Array(tile)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 hover:bg-gray-600 w-20 h-20 md:w-24 md:h-24 rounded-md shadow-md transition-all duration-200 cursor-pointer"
            ></div>
          ))}
      </div>
    </div>
  );
};

export default Room;
