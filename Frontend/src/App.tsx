import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./routes/Room";
import Home from "./routes/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
