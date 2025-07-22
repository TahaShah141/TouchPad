
const WebSocket = require('ws');
const robot = require('robotjs');

const wss = new WebSocket.Server({ port: 2025 });

console.log('WebSocket server started on port 2025');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type !== 'mousemove' && data.type !== 'scroll') 
        console.log({type: data.type});

      if (data.type === 'mousemove') {
        const { dx, dy } = data;
        if (dx === undefined || dy === undefined) return;
        const { x, y } = robot.getMousePos();
        robot.moveMouse(x + dx, y + dy);
      } else if (data.type === 'click') {
        robot.mouseClick();
      } else if (data.type === 'rightclick') {
        robot.mouseClick('right');
      }
      else if (data.type === 'scroll') {
        const { dx, dy } = data;
        robot.scrollMouse(dx, dy);
      }
    } catch (error) {
      console.error('Failed to parse message or execute action:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});
