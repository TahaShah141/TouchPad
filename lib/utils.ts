
export const getMacIP = async (): Promise<string> => {
  const response = await fetch('https://redirects-141.vercel.app/api/ip')
  
  if (!response.ok) throw Error("Error Fetching Mac IP");

  const { node } = await response.json()

  return node.value
}

const SENSITIVITY_FACTOR = 3; // Adjust this value as needed
const SCROLL_SENSITIVITY_FACTOR = 2.5; // Adjust this value as needed for scrolling

export const sendMessageWrapper = (ws: React.RefObject<WebSocket | null>) => 
(message: { type: string; dx?: number; dy?: number; direction?: 'up' | 'down' | 'left' | 'right' }) => {
  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    let finalDx = message.dx;
    let finalDy = message.dy;

    if (message.type === 'mousemove') {
      finalDx = message.dx ? message.dx * SENSITIVITY_FACTOR : undefined;
      finalDy = message.dy ? message.dy * SENSITIVITY_FACTOR : undefined;
    } else if (message.type === 'scroll' || message.type === 'threefingerdrag') {
      finalDx = message.dx ? message.dx * SCROLL_SENSITIVITY_FACTOR : undefined;
      finalDy = message.dy ? message.dy * SCROLL_SENSITIVITY_FACTOR : undefined;
    } else if (message.type === 'mousedown' || message.type === 'mouseup') {
      // No scaling needed for mousedown/mouseup events
      finalDx = message.dx;
      finalDy = message.dy;
    }

    const scaledMessage = {
      ...message,
      dx: finalDx,
      dy: finalDy,
    };
    ws.current.send(JSON.stringify(scaledMessage));
  } else {
    console.log('WebSocket not open. Current state:', ws.current?.readyState);
  }
};