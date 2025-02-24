import { useState } from "react";
import CreateRoom from "../component/CreateRoom";

const Home = ({ socket }) => {
  const [create, setCreate] = useState<boolean>(false);
  const [join, setJoin] = useState<boolean>(false);

  return (
    <div className="pt-12 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-evenly h-screen text-yellow-400 font-semibold">
      {/* Modal for Create/Join */}
      {create && (
        <CreateRoom
          socket={socket}
          title="Create Room"
          changeState={setCreate}
        />
      )}
      {join && (
        <CreateRoom socket={socket} title="Join Room" changeState={setJoin} />
      )}

      <div className="text-center">
        <h1 className="font-start text-3xl sm:text-6xl tracking-widest">
          CLICK STORM
        </h1>
        <h2 className="pt-4 font-start text-2xl sm:text-4xl tracking-wider">
          MULTIPLAYER CHALLENGE
        </h2>
      </div>

      {/* Game Description */}
      <div className="max-w-3xl text-center text-lg text-gray-300 space-y-4">
        <p>
          Welcome to{" "}
          <span className="text-yellow-400 font-bold">Click Storm</span> – the
          ultimate test of speed and reflexes!
        </p>
        <p>
          Challenge your friends in a fast-paced game where you must click on
          tiles as fast as possible within a given time frame. The player with
          the most clicks when the timer runs out wins!
        </p>
        <p>
          Create a room, invite your friends, and see who reigns supreme in the
          storm of clicks!
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center items-center p-8">
        <button
          onClick={() => setCreate(!create)}
          className="outline-none px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Create Room
        </button>

        <button
          onClick={() => setJoin(!join)}
          className="outline-none px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
