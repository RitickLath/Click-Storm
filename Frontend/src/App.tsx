import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./routes/Room";
import Home from "./routes/Home";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/:socketId/:roomName" element={<Room socket={socket} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
