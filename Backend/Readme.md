# BACKEND CLICK STORM 

## OVERVIEW
This backend server facilitates the creation and management of game rooms through WebSockets. Players can join rooms, play a real-time game, score points by hitting tiles on a grid, and receive live updates throughout the game.

## FEATURES
- **Create Room**: Players can create a new game room by providing a room name. The server initializes the room with player 1 and sets the game status to "ongoing."
- **Join Room**: Players can join an ongoing game room. Once joined, they are assigned as player 2, and the game starts.
- **Hit Tiles**: Players hit tiles on the grid to score points. Each tile can only be hit once.
- **Real-Time Updates**: The server sends real-time updates to all connected players, including tile colors and current scores.
- **Room Management**: Handles player connections, disconnections, and room clean-up when needed.

## CODE EXPLANATION

### 1. `roomArrayType` INTERFACE
Defines the structure of each game room:
- **roomName**: The name of the room.
- **player1/player2**: The socket IDs for the players in the room.
- **score1/score2**: The scores of player 1 and player 2.
- **color1/color2**: The colors assigned to each player.
- **gameStatus**: Indicates whether the game is "ongoing" or "finished."
- **colorArr**: An array representing the tiles on the grid.

### 2. `roomsArray`
Stores all active rooms during gameplay.

### 3. `initializeSocket(io)`
Sets up WebSocket connections and listens for incoming events:
- **createRoom**: Triggers when a user creates a room.
- **joinRoom**: Triggers when a user joins a room.
- **hit**: Triggers when a player hits a tile.
- **disconnect**: Triggers when a user disconnects.

### 4. `createRoom(data, socket, io)`
Creates a new room, assigns player 1, initializes the grid, and updates the room with the player's data.

### 5. `joinRoom(data, socket, io)`
Allows a player to join an ongoing game. If the room exists and the game is active, player 2 is assigned, and the game starts.

### 6. `hit(data, socket, io)`
Handles the logic when a player hits a tile:
- Validates if the tile is already hit.
- Assigns the hit tile to the current player and updates their score.
- Emits the updated game state to both players.

### 7. `disconnect(data)`
Handles the player disconnecting by removing the room from `roomsArray`.

## SETUP PROCESS

### REQUIREMENTS
- **Node.js**: Ensure that you have Node.js installed. You can download it from [https://nodejs.org](https://nodejs.org).
- **npm**: Node.js package manager, which comes bundled with Node.js.

### INSTALLATION

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**:
   Run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Set up TypeScript (if needed)**:
   - If you're working with TypeScript, make sure to install TypeScript globally and initialize it:
     ```bash
     npm install -g typescript
     tsc --init
     ```

4. **Create an `.env` file (optional)**:
   - If you want to store sensitive information like API keys, ports, or URLs, you can create a `.env` file in the root of the project.
   - Example of `.env`:
     ```env
     PORT=3000
     CORS_ORIGIN=http://localhost:5173
     ```

5. **Run the development server**:
   Use the following command to start the server in development mode using `nodemon`:
   ```bash
   npm run dev
   ```

6. **Access the server**:
   The server will now be running at `http://localhost:3000`.

### `index.js` (Server Entry Point)
The server uses Express and Socket.IO to handle incoming WebSocket connections and HTTP requests. The setup is as follows:

```js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeSocket } from "./sockets";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Frontend URL
  },
});

initializeSocket(io);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

## USAGE

### API/Events

- **createRoom**
  - Data: `{ roomName: string }`
  - Description: Creates a new game room.
  
- **joinRoom**
  - Data: `{ roomName: string }`
  - Description: Player joins an existing room.
  
- **hit**
  - Data: `{ roomName: string, index: number }`
  - Description: Player hits a tile at the specified index.
  
- **start game** (emitted by server)
  - Data: `{ player1: string, player2: string, roomName: string }`
  - Description: Sent to both players when the game starts.
  
- **color** (emitted by server)
  - Data: `{ color: string, index: number, player1: number, player2: number }`
  - Description: Sends the color of the hit tile to the client, along with the current scores.
  
- **updateScores** (emitted by server)
  - Data: `{ score1: number, score2: number }`
  - Description: Sends the updated scores of both players.

### EXAMPLE GAME FLOW
1. **Player 1** creates a room by sending the `createRoom` event.
2. **Player 2** joins the room by sending the `joinRoom` event.
3. The game starts, and both players can hit tiles by sending the `hit` event.
4. The game ends when all tiles are hit or when one player disconnects.

## CONCLUSION
This backend server facilitates multiplayer gaming with real-time interactions between players, supporting room creation, player joining, and live updates during gameplay.