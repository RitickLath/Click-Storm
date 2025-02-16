import { useState } from "react";
import CreateRoom from "../component/CreateRoom";

const Home = () => {
  const [create, setCreate] = useState<boolean>(false);
  const [join, setJoin] = useState<boolean>(false);

  return (
    <div className="pt-12 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-evenly h-screen text-yellow-400 font-semibold">
      {/* Modal for Create/Join  */}
      {create && <CreateRoom title="Create Room" changeState={setCreate} />}
      {join && <CreateRoom title="Join Room" changeState={setJoin} />}

      <div className="text-center">
        <h1 className="font-start text-3xl sm:text-5xl tracking-widest">
          CLICK STORM
        </h1>
        <h2 className="pt-6 font-start text-2xl text-center sm:text-4xl tracking-wider">
          MULTIPLAYER GAME
        </h2>
      </div>
      <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center items-center p-8">
        <button
          onClick={() => setCreate(!create)}
          className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Create Room
        </button>

        <button
          onClick={() => setJoin(!join)}
          className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
