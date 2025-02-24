interface roomArrayType {
  roomName?: string;
  player1?: string;
  player2?: string;
  score1?: number;
  score2?: number;
  color1?: "red";
  color2?: "green";
  gameStatus?: "ongoing" | "finished";
}

let roomsArray: roomArrayType[] = [];

export const initializeSocket = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("Connection Established: " + socket.id);

    // Create Room Request Listening
    socket.on("createRoom", (data: any) => createRoom(data, socket, io));

    // Join Room Request Listening
    socket.on("joinRoom", (data: any) => joinRoom(data, socket, io));

    // Increase Score Request Listening
    socket.on("hit", (data: any) => hit(data, socket, io));

    // Result of game
    socket.on("result", (data: any) => result(data, socket, io));

    // Disconnect the users
    socket.on("disconnect", (data: any) => disconnect(data));
  });
};

export const createRoom = (data: any, socket: any, io: any) => {
  const { roomName } = data;

  // Initialize room with game state
  roomsArray.push({
    roomName: roomName,
    player1: socket.id,
    score1: 0,
    score2: 0,
    color1: "red",
    color2: "green",
    gameStatus: "ongoing", // Initially the game is ongoing
  });

  socket.join(roomName);
  console.log("Room Created:", roomName);
};

export const joinRoom = (data: any, socket: any, io: any) => {
  const { roomName } = data;
  const room = roomsArray.find((r) => r.roomName === roomName);

  if (room && room.gameStatus === "ongoing") {
    room.player2 = socket.id;
    room.score2 = 0; // Start score for player2
    socket.join(roomName);
    console.log("Room joined:", roomName);

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
  const { roomName } = data;
  const roomObject = roomsArray.find((r) => r.roomName === roomName);

  if (roomObject && roomObject.gameStatus === "ongoing") {
    // Update score based on which player hit
    if (roomObject.player1 === socket.id) {
      // increment the score of player-1 as he/she had hitted
      roomObject.score1 = (roomObject.score1 || 0) + 1;
      // emit the color of player-1
      io.to(roomName).emit("color", { color: roomObject.color1 });
    } else if (roomObject.player2 === socket.id) {
      // increment the score of player-2 as he/she had hitted
      roomObject.score2 = (roomObject.score2 || 0) + 1;
      // emit the color of player-2
      io.to(roomName).emit("color", { color: roomObject.color2 });
    }

    // Emit updated scores
    io.to(roomName).emit("updateScores", {
      score1: roomObject.score1,
      score2: roomObject.score2,
    });
  } else {
    console.log("Room Not Found or Game Finished:", roomName);
  }
};

export const result = (data: any, socket: any, io: any) => {
  const { roomName } = data;
  const roomObject = roomsArray.find((r) => r.roomName === roomName);

  if (roomObject && roomObject.gameStatus === "ongoing") {
    // Determine the winner or if it's a tie
    let winner = "Tie";
    if ((roomObject.score1 || 0) > (roomObject.score2 || 0)) {
      winner = "Player-1";
    } else if ((roomObject.score2 || 0) > (roomObject.score1 || 0)) {
      winner = "Player-2";
    }

    // Emit the result
    io.to(roomName).emit("result", {
      player1: roomObject.score1,
      player2: roomObject.score2,
      winner,
    });

    // Mark the game as finished
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
