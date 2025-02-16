import { useRef } from "react";

interface PropType {
  changeState: (value: boolean) => void;
  title: "Create Room" | "Join Room";
}

const CreateRoom: React.FC<PropType> = ({ changeState, title }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tileRef = useRef<HTMLSelectElement | null>(null);
  const timeRef = useRef<HTMLSelectElement | null>(null);

  const handleCreate = () => {
    console.log("Room Name:", inputRef.current?.value || "No Room Name");
    console.log("Tiles:", tileRef.current?.value || "32");
    console.log("Time:", timeRef.current?.value || "30");
  };
  const handleJoin = () => {
    console.log("Room Name:", inputRef.current?.value || "No Room Name");
  };

  return (
    <div className="z-10 absolute inset-0 flex items-center justify-center">
      <div
        className={`relative w-[500px] ${
          title === "Create Room" ? "h-[400px]" : "h-[300px]"
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

        {/* Show Extra Inputs if Creating a Room */}
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

            {/* Select Game Duration */}
            <select
              ref={timeRef}
              className="w-full px-4 py-2 text-lg bg-black/40 text-white border-2 border-gray-500 rounded-md outline-none focus:border-purple-500"
            >
              <option value="30">30 Seconds</option>
              <option value="45">45 Seconds</option>
              <option value="60">60 Seconds</option>
            </select>
          </>
        )}

        {/* Create/Join Button */}
        <button
          onClick={title == "Create Room" ? handleCreate : handleJoin}
          className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
