interface roomArrayType {
  roomName?: string;
  player1?: string;
  player2?: string;
  score1?: number;
  score2?: number;
  color1?: "bg-red-700";
  color2?: "bg-green-700";
  gameStatus?: "ongoing" | "finished";
  colorArr?: string[];
}

let roomsArray: roomArrayType[] = [];

export const initializeSocket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("Connection Established: " + socket.id);

    socket.on("createRoom", (data: any) => createRoom(data, socket, io));
    socket.on("joinRoom", (data: any) => joinRoom(data, socket, io));
    socket.on("hit", (data: any) => hit(data, socket, io));
    socket.on("result", (data: any) => result(data, socket, io));
    socket.on("disconnect", (data: any) => disconnect(data));
  });
};

export const createRoom = (data: any, socket: any, io: any) => {
  const { roomName } = data;

  roomsArray.push({
    roomName: roomName,
    player1: socket.id,
    score1: 0,
    score2: 0,
    color1: "bg-red-700",
    color2: "bg-green-700",
    gameStatus: "ongoing",
    colorArr: Array(64).fill(""),
  });

  socket.join(roomName);
  console.log("Room Created:", roomName);
  console.log("Player-1: " + socket.id);
};

export const joinRoom = (data: any, socket: any, io: any) => {
  const { roomName } = data;
  const room = roomsArray.find((r) => r.roomName === roomName);

  if (room && room.gameStatus === "ongoing") {
    room.player2 = socket.id;
    room.score2 = 0; // Start score for player2
    socket.join(roomName);

    // Start the game by emitting start signal
    io.to(roomName).emit("start game", {
      player1: room.player1,
      player2: room.player2,
      roomName: room.roomName,
    });
  } else {
    console.log("Room Not Found or Game Already Finished:", roomName);
  }
};

export const hit = (data: any, socket: any, io: any) => {
  const { roomName, index } = data; // Include index of the hit tile
  const roomObject = roomsArray.find((r) => r.roomName === roomName);

  if (roomObject && roomObject.gameStatus === "ongoing") {
    //@ts-ignore
    if (roomObject?.colorArr[index] === "") {
      // Check if the tile has not been hit
      if (roomObject.player1 === socket.id) {
        roomObject.score1 = (roomObject.score1 || 0) + 1;
        // @ts-ignore
        roomObject?.colorArr[index] = roomObject.color1; // Mark the tile as hit by player 1
        io.to(roomName).emit("color", { color: roomObject.color1, index }); // Emit color to frontend
      } else if (roomObject.player2 === socket.id) {
        roomObject.score2 = (roomObject.score2 || 0) + 1;
        // @ts-ignore
        roomObject?.colorArr[index] = roomObject.color2; // Mark the tile as hit by player 2
        io.to(roomName).emit("color", { color: roomObject.color2, index }); // Emit color to frontend
      }

      io.to(roomName).emit("updateScores", {
        score1: roomObject.score1,
        score2: roomObject.score2,
      });
    } else {
      console.log("Tile already hit, cannot hit again.");
    }
  } else {
    console.log("Room Not Found or Game Finished:", roomName);
  }
};

export const result = (data: any, socket: any, io: any) => {
  const { roomName } = data;
  const roomObject = roomsArray.find((r) => r.roomName === roomName);

  if (roomObject && roomObject.gameStatus === "ongoing") {
    let winner = "Tie";
    if ((roomObject.score1 || 0) > (roomObject.score2 || 0)) {
      winner = "Player-1";
    } else if ((roomObject.score2 || 0) > (roomObject.score1 || 0)) {
      winner = "Player-2";
    }

    io.to(roomName).emit("result", {
      player1: roomObject.score1,
      player2: roomObject.score2,
      winner,
    });

    roomObject.gameStatus = "finished";
    console.log("Game finished:", roomName);
  } else {
    console.log("Room Not Found or Game Already Finished:", roomName);
  }
};

export const disconnect = (data: any) => {
  const { roomName } = data;
  const roomIndex = roomsArray.findIndex((r) => r.roomName === roomName);
  if (roomIndex !== -1) {
    roomsArray.splice(roomIndex, 1);
    console.log(`Room "${roomName}" has been removed due to disconnect.`);
  }
};
