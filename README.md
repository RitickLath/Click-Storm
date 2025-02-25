# Click Storm - Multiplayer Game

## Overview

Click Storm is a multiplayer challenge where players must click on tiles as quickly as possible to earn points. The player with the most clicks at the end of a timed round wins the game. This repository consists of a **frontend** and **backend** for the game, allowing users to join or create rooms and compete in real-time.

## Video


## Directory Structure

The repository is divided into two main directories:

- **frontend**: Contains the client-side application built with React.js.
- **backend**: Contains the server-side application built with Node.js, Express, and Socket.io.

---

## **Frontend**

The frontend is built with **React.js** and allows players to interact with the game in real-time. Players can create or join rooms, click on tiles to score points, and view the results at the end of the game.

### Key Features

- **Create/Join Room**: Users can create or join a game room by providing a room name.
- **Game Timer**: A countdown timer is displayed, and the game ends after 30 seconds.
- **Real-time Score Updates**: Players' scores are updated in real-time based on their interactions with the game grid.
- **Tile Grid**: Players click on tiles that change color upon click, and their scores are updated accordingly.
- **Responsive Design**: The frontend is fully responsive and adapts to different screen sizes using **Tailwind CSS**.

### Tech Stack

- **React.js**: JavaScript library for building user interfaces.
- **React Router**: For routing between the home page and the game room.
- **Socket.io Client**: For real-time communication with the server.
- **Typescript**: For Strict Type safety.
- **Tailwind CSS**: For styling the application.

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## **Backend**

The backend is built with **Node.js** and **Express**, using **Socket.io** for real-time communication between players. It handles room creation, player connection, score management, and game timer logic.

### Key Features

- **Room Management**: Allows users to create and join rooms.
- **Real-time Interaction**: Sends and receives events related to tile clicks and player scores.
- **Game Logic**: Manages the game timer and determines the winner based on player scores.
- **Socket.io Server**: Handles real-time events for tile color changes, player score updates, and game start/end signals.

### Tech Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js to handle HTTP requests.
- **Socket.io**: Real-time communication library for WebSockets.
- **Cors**: A middleware to allow cross-origin requests.

### Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. The server will start running on **http://localhost:3000**.

---

## **How to Play**

1. **Start the Game**:

   - Visit the homepage and either **create a room** or **join an existing room**.
   - The "Create Room" option will allow you to generate a new room and wait for another player to join.
   - The "Join Room" option allows you to join a room by entering the room's name.

2. **In the Game Room**:

   - Once two players are in the room, the game starts with a 30-second timer.
   - Players take turns clicking on tiles on the game grid to score points.
   - The player with the most points when the timer runs out is declared the winner.

3. **End of the Game**:
   - After the game ends, the results are displayed. A winner is determined based on the score.
   - The page will display a message showing who won or if the game ended in a tie.

---

## **Future Improvements**

- **User Authentication**: Adding user accounts and authentication to save high scores.
- **Game Variants**: Introducing different tile grids (e.g., 256 tiles) for varied difficulty.
- **Multiplayer Enhancements**: Adding more players to the game room.
- **Leaderboard**: Implementing a global leaderboard to track top players.
- **Chat**: Enabling in-game chat between players.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Contributing**

If you'd like to contribute to the project, feel free to fork the repository, make changes, and create a pull request. All contributions are welcome!

---

## **Acknowledgments**

- **Tailwind CSS** for the excellent utility-first CSS framework.
- **React.js** for the powerful and efficient UI library.
- **Socket.io** for enabling real-time interactions in the game.
