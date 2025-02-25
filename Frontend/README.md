# FRONTEND CLICK STORM

## OVERVIEW

This frontend client is designed for the **Click Storm** multiplayer game, where players can create or join a game room, click on tiles to score points, and compete in real-time. The game features a grid of tiles, where players must quickly click on tiles to accumulate points, and the player with the most clicks wins when the timer runs out.

## COMPONENT LOGIC

### 1. **App.js (Main Component)**

- **Role**: This is the main entry point of the application, responsible for setting up routing and socket communication.
- **Functionality**:
  - The `react-router-dom` library is used to navigate between pages. It sets up two routes:
    - The home page (`/`) where users can either create or join a game room.
    - The game room page (`/:socketId/:roomName/:admin`), where the game happens.
  - The socket connection (`io()`) is initialized here and passed down to other components to handle real-time interactions.

### 2. **Home.js (Home Page)**

- **Role**: The home page serves as the entry point where players can choose to create or join a room.
- **Functionality**:
  - **State management**: Uses `useState` hooks to manage modals for creating and joining rooms.
  - **UI Elements**:
    - A description of the game and its rules is displayed to the user.
    - Two buttons are provided:
      - One to create a room.
      - One to join an existing room.
  - **Create/Join Room Modal**: Upon clicking the respective button, a modal appears to either create or join a room by entering a room name.

### 3. **CreateRoom.js (Create/Join Room Modal)**

- **Role**: This component handles the creation and joining of rooms.
- **Functionality**:
  - **Room Creation**: When creating a room, the user provides a room name. A socket event is emitted to the backend to create the room. The player becomes the "admin" of the room and waits for the second player to join.
  - **Room Joining**: When joining a room, the user provides a room name. If the room exists, the socket emits a request to join it.
  - **Socket Communication**: The component listens for events from the backend, including when the game should start, and navigates to the game room page when the game is ready to begin.

### 4. **Room.js (Game Room)**

- **Role**: This component represents the game room, where the main gameplay happens.
- **Functionality**:
  - **Grid of Tiles**: A grid of clickable tiles is rendered. Each tile is clickable, and when a tile is clicked, an event is emitted to the backend, updating the tile color and the player's score.
  - **Timer**: A countdown timer runs for 30 seconds. When the timer reaches zero, the game ends, and the player with the highest score wins. The game automatically ends after the timer expires, and the result is displayed.
  - **Real-time Score Update**: The component listens for score updates from the server and updates the UI in real-time.
  - **Winner Display**: Once the game ends, a message is displayed to show whether the player won, lost, or if the game ended in a tie.

### 5. **Socket.io Communication**

- **Real-time Interaction**: Socket.io is used to facilitate real-time communication between the client and the server.
  - **Tile Clicks**: When a player clicks on a tile, the frontend emits a `hit` event with the tile's index and the player's score. The backend responds by updating the tile color and sending the updated score to both players.
  - **Game State**: The frontend listens for events like game start and game over from the backend, and updates the UI accordingly (e.g., showing the winner or handling game reset).

### 6. **Game Timer**

- **Role**: The game timer counts down from 30 seconds.
- **Functionality**:
  - Every second, the timer is updated, and when it hits zero, the game ends, and the winner is determined.
  - The timer logic is managed using the `useState` hook and `useEffect` to trigger updates.

### 7. **Styling with Tailwind CSS**

- **Utility-Based Styling**: The application is styled using **Tailwind CSS**, which allows for responsive layouts, hover effects, and smooth transitions. Key UI elements, like the grid tiles, buttons, and modal, are styled using Tailwind's utility classes.
- **Responsive Design**: Tailwind CSS ensures that the UI adapts to different screen sizes, especially for devices like tablets and smartphones.

---

## GAMEPLAY FLOW

1. **Start**:
   - A user visits the home page and either creates or joins a room.
   - After selecting an option, the user is redirected to a modal where they can input the room name.
2. **Room Creation/Join**:

   - Upon creating a room, the user waits for another player to join. The user becomes the room's admin.
   - Upon joining a room, the player waits for the game to start. The first player to join will be the "admin".

3. **Gameplay**:

   - The game begins with a grid of clickable tiles displayed to both players.
   - Players click on tiles to score points. Each tile changes color when clicked.
   - A 30-second countdown timer starts, and the players' scores are updated in real-time.

4. **End of Game**:
   - The game ends when the timer reaches zero. The winner is determined by comparing the scores.
   - A message is displayed showing the winner or if the game ended in a tie.

---

This frontend client allows for an engaging multiplayer experience, utilizing real-time interactions to create an exciting and fast-paced game. The player interactions with the game grid and the backend communication through socket events enable dynamic gameplay where speed and reflexes are key!
