# Phone Trackpad Project Specifications

This document outlines the step-by-step specifications for creating a custom project that allows a mobile phone to function as a trackpad for a Mac computer. A code agent can follow these instructions to implement the application.

## 1. Project Overview

The primary goal of this project is to enable a smartphone to control the mouse cursor and scrolling on a macOS device via a local network connection. This will be achieved using a Node.js WebSocket server running on the Mac and a React Native mobile application. The implementation will prioritize core functionality for an initial working version.

## 2. Core Technologies

### Server-Side:

- **Node.js:** Runtime environment.
- **TypeScript:** For type-safe JavaScript development.
- **ws:** WebSocket library for Node.js.
- **robotjs:** Node.js library for desktop automation (mouse control).

### Client-Side:

- **React Native:** Framework for building cross-platform mobile apps.
- **TypeScript:** For type-safe React Native development.
- **Expo:** Toolchain for React Native development (simplifies setup and deployment).
- **NativeWind:** Utility-first CSS framework for React Native (Tailwind CSS for mobile).
- **react-native-websocket:** WebSocket client for React Native.
- **react-native-gesture-handler:** For advanced touch gestures.

## 3. High-Level Architecture

The system will consist of two main components:

- **Server Application (Node.js):**
    - Runs on the macOS machine.
    - Listens for incoming WebSocket connections from the mobile app.
    - Receives mouse movement and scroll data.
    - Uses `robotjs` to translate received data into actual mouse cursor movements and scroll events on the Mac.

- **Client Application (React Native):**
    - Runs on the smartphone (iOS/Android).
    - Connects to the Node.js WebSocket server.
    - Captures touch events (pan gestures for movement, pinch/two-finger scroll for scrolling).
    - Sends formatted mouse movement and scroll data to the server.
    - Displays connection status.

```mermaid
graph TD
    A[Mobile Phone] -- WebSocket --> B[Mac (Node.js Server)]
    B -- robotjs --> C[Mac OS Mouse/Scroll Events]
    A -- Touch Gestures --> A
```

## 4. Server-Side (Node.js) Specifications

The Node.js server will handle WebSocket connections and control the mouse.

### 4.1. Setup and Dependencies

- Initialize a Node.js project.
- Install necessary packages: `ws`, `robotjs`, `typescript`, `ts-node`.
- Configure `tsconfig.json` for TypeScript compilation.

```bash
npm init -y
npm install ws robotjs typescript ts-node @types/ws @types/node
npx tsc --init # Initialize tsconfig.json
```

### 4.2. WebSocket Server Implementation

- Create a WebSocket server instance.
- Listen on a specific port (e.g., 2025).
- Handle new connections (`connection` event).
- Handle incoming messages (`message` event).
- Handle disconnections (`close` event) and errors (`error` event).

### 4.3. `robotjs` Integration

- Upon receiving a message from the client, parse the data to determine the type of action (mouse move, scroll).
- **Mouse Movement:**
    - `robotjs.moveMouse(x, y)`: Move the mouse cursor to absolute coordinates.
    - Alternatively, `robotjs.moveMouseRelative(dx, dy)`: Move the mouse cursor by a relative amount. This is generally preferred for trackpad-like behavior.
- **Scrolling:**
    - `robotjs.scrollMouse(x, y)`: Scroll the mouse wheel. `x` for horizontal, `y` for vertical.
    - The client will send scroll deltas.

### 4.4. Communication Protocol (Server-Side Parsing)

The server will expect JSON messages from the client. The JSON structure will define the action and its parameters.

**Example Message Structures:**

- **Mouse Movement:**
    ```json
    {
        "type": "mousemove",
        "dx": 5,
        "dy": -10
    }
    ```
- **Scroll:**
    ```json
    {
        "type": "scroll",
        "dx": 0,
        "dy": -10
    }
    ```
- **Click (Optional, for future expansion):**
    ```json
    {
        "type": "click",
        "button": "left"
    }
    ```

- Implement a `try-catch` block for JSON parsing to handle malformed messages.
- Define TypeScript interfaces for these message structures to ensure type safety.

### 4.5. Error Handling and Logging

- Log server start-up, client connections, disconnections, and errors.
- Implement basic error handling for WebSocket events and `robotjs` operations.

### 4.6. Security Considerations (Basic)

For a local network application, robust security might not be the highest priority initially, but consider:

- **IP Whitelisting (Optional):** Only accept connections from known IP addresses.
- **Simple Passcode (Optional):** Require a shared secret sent during connection for basic authentication.

## 5. Client-Side (React Native) Specifications

The React Native app will capture touch input and send it to the server.

### 5.1. Expo and NativeWind Setup

- Initialize a new Expo project with a blank template (ensure it supports TypeScript).
- Configure NativeWind for Tailwind CSS styling.

```bash
npx create-expo-app trackpad-app --template expo-template-blank-typescript
cd trackpad-app
# Follow NativeWind setup instructions (usually involves installing nativewind, tailwindcss, and configuring babel.config.js, tailwind.config.js)
```

### 5.2. WebSocket Client Connection

- Use `react-native-websocket` or the native WebSocket API.
- The app should have an input field for the server's IP address and port, and a "Connect" button.
- Display the current connection status (e.g., "Disconnected", "Connecting...", "Connected").
- Implement reconnection logic if the connection is lost.

### 5.3. Touch Event Handling

- Use `react-native-gesture-handler` for robust gesture detection.
- **Mouse Movement (Pan Gesture):**
    - Implement a `PanGestureHandler` on a large, central view (the "trackpad" area).
    - On `onGestureEvent`, capture `translationX` and `translationY` (or `velocityX`, `velocityY` for smoother, velocity-based movement).
    - Send these deltas (`dx`, `dy`) to the server as a `mousemove` type message.
    - Consider debouncing or throttling the sending of `mousemove` events to avoid overwhelming the server.
- **Scrolling (Two-Finger Pan Gesture):**
    - Implement a separate `PanGestureHandler` configured for two fingers.
    - Capture `translationY` for vertical scroll, and `translationX` for horizontal scroll.
    - Send these deltas (`dx`, `dy`) to the server as a `scroll` type message.
    - Adjust sensitivity as needed.

### 5.4. Sending Data to Server

- Format the captured touch data into the defined JSON protocol.
- Use `WebSocket.send(JSON.stringify(message))` to send data.
- Define TypeScript interfaces for the messages to ensure type safety when sending.

### 5.5. UI/UX Considerations

- **Clean Interface:** A minimalist design with a large, responsive trackpad area.
- **Connection Status:** Clearly visible text indicating connection status.
- **IP Input:** An `TextInput` for the server IP address and port.
- **Connect/Disconnect Button:** A button to initiate/terminate the connection.
- **Styling:** Utilize NativeWind for a modern, responsive look. Ensure the trackpad area fills most of the screen.
- **Feedback:** Visual feedback on touch (e.g., a subtle highlight on touch).

## 6. Communication Protocol (Client-Side Sending)

As defined in section 4.4, the client will send JSON objects:

- **Mouse Movement:**
    ```json
    {
        "type": "mousemove",
        "dx": <number>,
        "dy": <number>
    }
    ```
- **Scroll:**
    ```json
    {
        "type": "scroll",
        "dx": <number>,
        "dy": <number>
    }
    ```

## 7. Step-by-Step Implementation Plan for Code Agent

The code agent should follow these steps:

1.  **Server-Side Setup and Basic WebSocket:**
    -   Create a new Node.js project directory (e.g., `mac-trackpad-server`).
    -   Initialize `package.json` and install `ws`, `robotjs`, `typescript`, `ts-node`, and their respective `@types` packages.
    -   Create `tsconfig.json` using `npx tsc --init`.
    -   Create `src/server.ts`.
    -   Implement a basic WebSocket server in `server.ts` that listens on port 2025.
    -   Log when a client connects and disconnects.
    -   Add a simple message handler that logs any received message to the console.

2.  **Server-Side Mouse Movement with `robotjs`:**
    -   In `src/server.ts`, modify the message handler.
    -   Parse incoming messages as JSON and validate their type using TypeScript interfaces.
    -   If `message.type` is `"mousemove"`, use `robotjs.moveMouseRelative(message.dx, message.dy)` to move the mouse.
    -   Add `try-catch` blocks for JSON parsing and `robotjs` calls.

3.  **Server-Side Scrolling with `robotjs`:**
    -   In `src/server.ts`, extend the message handler.
    -   If `message.type` is `"scroll"`, use `robotjs.scrollMouse(message.dx, message.dy)` to perform scrolling.

4.  **Client-Side Expo and NativeWind Setup:**
    -   Create a new Expo project (e.g., `phone-trackpad-app`) using the TypeScript template.
    -   Install `nativewind`, `tailwindcss`, `react-native-gesture-handler`, and `react-native-reanimated`.
    -   Configure `babel.config.js` and `tailwind.config.js` for NativeWind.
    -   Set up the basic `App.tsx` structure with a `SafeAreaView` and some placeholder text styled with NativeWind.

5.  **Client-Side WebSocket Connection UI and Logic:**
    -   In `App.tsx`, create state variables for `ipAddress`, `port`, `isConnected`, and `ws` (typed as `WebSocket | null`).
    -   Add `TextInput` components for IP address and port.
    -   Add a "Connect" button.
    -   Implement a `connectWebSocket` function:
        -   Construct the WebSocket URL (e.g., `ws://${ipAddress}:${port}`).
        -   Create a new `WebSocket` instance.
        -   Set up `onopen`, `onmessage`, `onerror`, and `onclose` event handlers.
        -   Update `isConnected` state accordingly.
        -   Store the WebSocket instance in state.
    -   Add a "Disconnect" button that calls `ws?.close()`.
    -   Display connection status text (e.g., "Connected to: " + IP, "Disconnected").

6.  **Client-Side Mouse Movement Gesture:**
    -   Wrap the main "trackpad" area (a `View` component) with a `GestureDetector` from `react-native-gesture-handler`.
    -   Use `Gesture.Pan()` to create a pan gesture handler.
    -   Configure `onUpdate` or `onEnd` to capture `translationX` and `translationY` (or `velocityX`, `velocityY`).
    -   Send these values as a `mousemove` message to the server via the WebSocket connection, ensuring the message object conforms to the defined TypeScript interface.
    -   Ensure the `GestureDetector` is configured to reset translation after each gesture.

7.  **Client-Side Scrolling Gesture:**
    -   Add another `Gesture.Pan()` handler to the same "trackpad" area or a separate dedicated area for scrolling.
    -   Configure this pan gesture to require two fingers (`minPointers(2)`).
    -   In `onUpdate` or `onEnd`, capture `translationY` for vertical scroll and `translationX` for horizontal scroll.
    -   Send these values as a `scroll` message to the server, ensuring the message object conforms to the defined TypeScript interface.
    -   Adjust the sensitivity of the scroll deltas before sending (e.g., divide by a factor to make it less sensitive).

8.  **Refinements and Polish:**
    -   **Sensitivity Adjustment:** Add options (or hardcode initial values) to adjust mouse movement and scroll sensitivity on the client side.
    -   **UI Layout:** Use NativeWind to make the app visually appealing, with a large, clear trackpad area. Ensure responsiveness across different phone sizes.
    -   **Error Messages:** Display user-friendly error messages if WebSocket connection fails or data sending encounters issues.
    -   **IP Address Persistence (Optional):** Use `AsyncStorage` to save the last connected IP address.
    -   **Mac Firewall Configuration (Instructions for User):** Remind the user that they might need to allow incoming connections for the Node.js server through their Mac's firewall.
