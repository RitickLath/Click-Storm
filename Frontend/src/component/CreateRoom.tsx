import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PropType {
  changeState: (value: boolean) => void;
  title: "Create Room" | "Join Room";
  socket: any;
}

const CreateRoom: React.FC<PropType> = ({ changeState, title, socket }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tileRef = useRef<HTMLSelectElement | null>(null);
  const [admin, setAdmin] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle start game event when received
    const handleStartGame = (data: {
      player1: string;
      player2: string;
      roomName: string;
    }) => {
      if (data.player1 === socket.id || data.player2 === socket.id) {
        navigate(`/${socket.id}/${data.roomName}/${admin ? 0 : 12}`);
      }
    };

    socket.on("start game", handleStartGame);

    return () => {
      socket.off("start game", handleStartGame);
    };
  }, [navigate, socket, admin]);

  const handleCreate = () => {
    if (!inputRef.current?.value) {
      alert("Please enter a room name.");
      return;
    }

    const roomName = inputRef.current.value;
    setAdmin(true);
    setWaitingForPlayer(true); // Set waiting state when room is created
    socket.emit("createRoom", { roomName });
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

        {/* Waiting for Player message */}
        {waitingForPlayer && (
          <div className="text-white text-xl mt-4">
            Waiting for the other player to join...
          </div>
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

/**
 * CreateRoom Component - This component is responsible for creating or joining a game room.
 *
 * Basic Flow:
 * 1. **Props**:
 *    - `changeState`: A function passed as a prop to close the modal when the user is done.
 *    - `title`: A string that determines whether the component is in "Create Room" or "Join Room" mode.
 *    - `socket`: A socket instance used to communicate with the backend server for room creation and joining.
 *
 * 2. **Component Setup**:
 *    - `useRef` is used to keep references to the room name input field (`inputRef`) and the tile number select dropdown (`tileRef`).
 *    - `useState` is used to manage component state:
 *      - `admin`: A boolean state that determines if the current user is the admin (creator) of the room.
 *      - `waitingForPlayer`: A new state used to display a message when the room is created, and the system is waiting for another player to join.
 *
 * 3. **Event Handling**:
 *    - **Create Room**:
 *      - The `handleCreate` function is triggered when the user clicks the "Create Room" button.
 *      - It checks if the room name is provided. If not, an alert is shown.
 *      - If the room name is valid, it emits a `createRoom` event to the backend with the room name and sets the current user as the admin.
 *      - The `waitingForPlayer` state is set to `true` to show a waiting message while the room is waiting for the second player to join.
 *
 *    - **Join Room**:
 *      - The `handleJoin` function is triggered when the user clicks the "Join Room" button.
 *      - It checks if the room name is provided. If not, an alert is shown.
 *      - If the room name is valid, it emits a `joinRoom` event to the backend to join the room.
 *      - The `admin` state is set to `false` since the user is joining an existing room.
 *
 * 4. **Socket Communication**:
 *    - The component listens for the `start game` event from the backend using `socket.on("start game")`.
 *    - When the `start game` event is received, the component checks if the current user is part of the game (either `player1` or `player2`).
 *    - If the user is part of the game, they are redirected to the room page using `navigate` with their `socket.id`, the `roomName`, and their admin status (either `0` or `12`).
 *    - The `socket.off("start game")` is used to clean up the event listener when the component is unmounted.
 *
 * 5. **UI Rendering**:
 *    - The component renders a modal with:
 *      - A room name input field to enter the name of the room.
 *      - A select dropdown for the number of tiles (only visible when the user is creating a room).
 *      - A "Waiting for player" message that is displayed when the room is created and waiting for the second player.
 *      - A button that changes its label to either "Create Room" or "Join Room" depending on the `title` prop.
 *
 * 6. **Navigation**:
 *    - Upon successful room creation or joining, the user is navigated to a new page for the game room using `navigate`.
 *    - The `navigate` method ensures that the user is redirected to the appropriate room page after the game starts.
 *
 * Notes:
 * - If the user is creating a room, they can select the number of tiles (32, 64, or 128 tiles).
 * - If the user is joining a room, they simply need to input the room name and join.
 * - The `waitingForPlayer` state controls whether the component shows the message "Waiting for the other player to join..." or not.
 */
