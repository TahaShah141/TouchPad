const WebSocket = require('ws');
const robot = require('robotjs');
const { triggerMissionControl } = require('./utils');

const WS_PORT = 2025;
const HOST = '0.0.0.0';

const wss = new WebSocket.Server({ host: HOST, port: WS_PORT });

wss.on('listening', () => {
  console.log(`WebSocket server is listening on ws://${HOST}:${WS_PORT}`);
});

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`Client connected to WebSocket from: ${clientIp}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'mousemove') {
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