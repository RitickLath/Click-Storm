// user will create a room
// user will wait till the other player will join the room
// if other player joins the room backend will send "start game"  message with socket id of both
// and if we gets the socket id as message from backend we will start the game

import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// const socket = io("http://localhost:3000");

interface PropType {
  changeState: (value: boolean) => void;
  title: "Create Room" | "Join Room";
  socket: any;
}

const CreateRoom: React.FC<PropType> = ({ changeState, title, socket }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tileRef = useRef<HTMLSelectElement | null>(null);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle start game event when received
    const handleStartGame = (data: {
      player1: string;
      player2: string;
      roomName: string;
    }) => {
      if (data.player1 == socket.id || data.player2 == socket.id) {
        // if admin navitation last endpoint have 0
        navigate(`/${socket.id}/${data.roomName}/${admin ? 0 : 12}`);
      }
    };

    socket.on("start game", handleStartGame);

    return () => {
      socket.off("start game", handleStartGame);
    };
  }, [navigate]);

  const handleCreate = () => {
    if (!inputRef.current?.value) {
      alert("Please enter a room name.");
      return;
    }

    const roomName = inputRef.current.value;
    setAdmin(true);
    socket.emit("createRoom", {
      roomName,
    });
  };

  const handleJoin = () => {
    if (!inputRef.current?.value) {
      alert("Please enter a room name.");
      return;
    }

    const roomName = inputRef.current.value;
    setAdmin(false);
    socket.emit("joinRoom", { roomName });
  };

  return (
    <div className="z-10 absolute inset-0 flex items-center justify-center">
      <div
        className={`relative w-[500px] ${
          title === "Create Room" ? "h-[500px]" : "h-[300px]"
        } bg-black/40 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center space-y-6`}
      >
        {/* Close Button */}
        <button
          onClick={() => changeState(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition"
        >
          ✖
        </button>

        {/* Room Name Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Room Name"
          className="w-full px-4 py-2 text-lg text-white bg-transparent border-2 border-gray-500 rounded-md outline-none focus:border-purple-500 placeholder-gray-400"
        />

        {title === "Create Room" && (
          <>
            {/* Select Number of Tiles */}
            <select
              ref={tileRef}
              className="w-full px-4 py-2 text-lg bg-black/40 text-white border-2 border-gray-500 rounded-md outline-none focus:border-purple-500"
            >
              <option value="32">32 Tiles</option>
              <option value="64">64 Tiles</option>
              <option value="128">128 Tiles</option>
            </select>
          </>
        )}

        {/* Create/Join Button */}
        <button
          onClick={title === "Create Room" ? handleCreate : handleJoin}
          className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
