# TouchPad: A Wireless Keyboard and Mouse

This application allows you to use your mobile device as a wireless keyboard and mouse for your computer.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)

## Getting Started

1.  **Start the server:**
    - Open your terminal.
    - Navigate to the `server` directory within the project folder.
    - Install dependencies by running:
      ```bash
      npm install
      ```
    - Run the following command to start the server:
      ```bash
      node server.js
      ```
    - You should see a QR code displayed in the terminal.

2.  **Install the app:**
    - An APK file (`app-release.apk`) is provided in the root directory of this project.
    - Install this APK on your Android device.

3.  **Connect the app:**
    - Open the TouchPad app on your phone.
    - Scan the QR code displayed in your terminal.
    - The app should connect to the server, and you can now use your phone as a trackpad and keyboard.

## Gestures

### Trackpad Mode

-   **One-finger tap:** Left click
-   **Two-finger tap:** Right click
-   **Three-finger tap:** Double click
-   **Four-finger tap:** Switch to keyboard mode
-   **One-finger pan:** Move the mouse
-   **Two-finger pan:** Scroll
-   **Three-finger pan:** Drag and drop
-   **Four-finger swipe:** Mission Control (macOS only)

#### You can setup mission control (switching spaces) for your own device in the server file.

### Keyboard Mode

-   **Power key:** Go back to mouse/trackpad mode
-   **Two-finger swipe:** Use arrow keys (up, down, left, right)
-   **Three-finger swipe:** Switch between tabs or applications
-   **Four-finger swipe:** Editing controls (e.g., undo, redo)

#### You can change these around if you want inside the server file itself

## Learn more

To learn more about developing your project with Expo, look at the following resources:

-   [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
-   [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

-   [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
-   [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.