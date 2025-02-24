"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.result = exports.hit = exports.joinRoom = exports.createRoom = exports.initializeSocket = void 0;
let roomsArray = [];
const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Connection Established: " + socket.id);
        // Create Room Request Listening
        socket.on("createRoom", (data) => (0, exports.createRoom)(data, socket, io));
        // Join Room Request Listening
        socket.on("joinRoom", (data) => (0, exports.joinRoom)(data, socket, io));
        // Increase Score Request Listening
        socket.on("hit", (data) => (0, exports.hit)(data, socket, io));
        // Result of game
        socket.on("result", (data) => (0, exports.result)(data, socket, io));
        // Disconnect the users
        socket.on("disconnect", (data) => (0, exports.disconnect)(data));
    });
};
exports.initializeSocket = initializeSocket;
const createRoom = (data, socket, io) => {
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
exports.createRoom = createRoom;
const joinRoom = (data, socket, io) => {
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
    }
    else {
        console.log("Room Not Found or Game Already Finished:", roomName);
    }
};
exports.joinRoom = joinRoom;
const hit = (data, socket, io) => {
    const { roomName } = data;
    const roomObject = roomsArray.find((r) => r.roomName === roomName);
    if (roomObject && roomObject.gameStatus === "ongoing") {
        // Update score based on which player hit
        if (roomObject.player1 === socket.id) {
            // increment the score of player-1 as he/she had hitted
            roomObject.score1 = (roomObject.score1 || 0) + 1;
            // emit the color of player-1
            io.to(roomName).emit("color", { color: roomObject.color1 });
        }
        else if (roomObject.player2 === socket.id) {
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
    }
    else {
        console.log("Room Not Found or Game Finished:", roomName);
    }
};
exports.hit = hit;
const result = (data, socket, io) => {
    const { roomName } = data;
    const roomObject = roomsArray.find((r) => r.roomName === roomName);
    if (roomObject && roomObject.gameStatus === "ongoing") {
        // Determine the winner or if it's a tie
        let winner = "Tie";
        if ((roomObject.score1 || 0) > (roomObject.score2 || 0)) {
            winner = "Player-1";
        }
        else if ((roomObject.score2 || 0) > (roomObject.score1 || 0)) {
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
    }
    else {
        console.log("Room Not Found or Game Already Finished:", roomName);
    }
};
exports.result = result;
const disconnect = (data) => {
    const { roomName } = data;
    const roomIndex = roomsArray.findIndex((r) => r.roomName === roomName);
    if (roomIndex !== -1) {
        roomsArray.splice(roomIndex, 1);
        console.log(`Room "${roomName}" has been removed due to disconnect.`);
    }
};
exports.disconnect = disconnect;
