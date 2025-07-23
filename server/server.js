const WebSocket = require('ws');
const http = require('http'); // Import the http module
const robot = require('robotjs');
const { triggerMissionControl } = require('./utils');

const WS_PORT = 2025;
const HTTP_PORT = 8000; // Define a separate port for the HTTP server
const HOST = '0.0.0.0'; // Listen on all available network interfaces

// --- WebSocket Server ---
const wss = new WebSocket.Server({ host: HOST, port: WS_PORT });

wss.on('listening', () => {
  console.log(`WebSocket server is listening on ws://${HOST}:${WS_PORT}`);
  console.log('Waiting for client connections...');
});

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`Client connected to WebSocket from: ${clientIp}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString()); 
      console.log(`Received message from ${clientIp}:`, data);

      if (data.type === 'echo') {
        console.log(`Echo message from ${clientIp}: ${data.msg}`);
        ws.send(`Server received echo: ${data.msg}`);
      } else if (data.type === 'mousemove') {
        const { dx, dy } = data;
        if (dx === undefined || dy === undefined) return;
        const { x, y } = robot.getMousePos();
        robot.moveMouse(x + dx, y + dy);
      } else if (data.type === 'threefingerdrag') {
        const { dx, dy } = data;
        if (dx === undefined || dy === undefined) return;
        const { x, y } = robot.getMousePos();
        robot.dragMouse(x + dx, y + dy);
      } else if (data.type === 'mousedown') {
        robot.mouseToggle('down', 'left');
      } else if (data.type === 'mouseup') {
        robot.mouseToggle('up', 'left');
      } else if (data.type === 'click') {
        robot.mouseClick();
      } else if (data.type === 'rightclick') {
        robot.mouseClick('right');
      } else if (data.type === 'doubleclick') {
        robot.mouseClick('left', true)
      } else if (data.type === 'scroll') {
        const { dx, dy } = data;
        robot.scrollMouse(dx, dy);
      } else if (data.type === 'spacechange') {
        const { direction } = data;
        triggerMissionControl(direction)
      }
    } catch (error) {
      console.error(`Failed to parse message or execute action from ${clientIp}:`, error);
      ws.send(JSON.stringify({ type: 'error', message: 'Server failed to process message.' }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected from ${clientIp}. Code: ${code}, Reason: ${reason.toString()}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientIp}:`, error);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// --- HTTP Server for Connectivity Test ---
const httpServer = http.createServer((req, res) => {
  // Log every incoming HTTP request for debugging
  console.log(`HTTP request received from: ${req.socket.remoteAddress} for URL: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Mac Server! If you see this, basic network connectivity is working.\n');
});

httpServer.listen(HTTP_PORT, HOST, () => {
  console.log(`HTTP server is listening on http://${HOST}:${HTTP_PORT}`);
});

httpServer.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`HTTP Port ${HTTP_PORT} is already in use. Please choose a different port or stop the other process.`);
  } else {
    console.error('HTTP server error:', e);
  }
});
