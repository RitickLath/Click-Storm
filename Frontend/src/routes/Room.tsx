import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Room = ({ socket }) => {
  const { roomName } = useParams();
  const [arr, setArr] = useState(Array(64).fill("bg-gray-800"));

  // Listen for color updates from the backend
  useEffect(() => {
    socket.on("color", (data) => {
      const { color, index } = data; 
      setArr((prevArr) => {
        const updatedArr = [...prevArr];
        updatedArr[index] = color; 
        return updatedArr;
      });
    });

    return () => {
      socket.off("color");
    };
  }, [socket]);

  const handleHit = (index: number) => {
    socket.emit("hit", { roomName: roomName, index });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden px-2">
      {/* Timer Display */}
      <h1 className="text-3xl text-white font-bold py-4">{40}</h1>

      <div className="flex flex-wrap space-x-2 space-y-2 justify-center">
        {arr.map((color, index) => (
          <div
            key={index}
            onClick={() => handleHit(index)}
            className={`${color} hover:bg-gray-600 w-20 h-20 md:w-24 md:h-24 rounded-md shadow-md transition-all duration-200 cursor-pointer`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Room;
