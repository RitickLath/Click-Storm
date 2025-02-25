import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./routes/Room";
import Home from "./routes/Home";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* For admin 0 for non admin non-zero */}
        <Route path="/" element={<Home socket={socket} />} />
        <Route
          path="/:socketId/:roomName/:admin"
          element={<Room socket={socket} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
