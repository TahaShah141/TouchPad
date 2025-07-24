
export const getMacIP = async (): Promise<string> => {
  const response = await fetch('https://redirects-141.vercel.app/api/ip')
  
  if (!response.ok) throw Error("Error Fetching Mac IP");

  const { node } = await response.json()

  return node.value
}

const SENSITIVITY_FACTOR = 3; // Adjust this value as needed
const SCROLL_SENSITIVITY_FACTOR = 2.5; // Adjust this value as needed for scrolling

export type MessagePayload = 
  | { type: 'mousemove' | 'scroll' | 'threefingerdrag'; dx: number; dy: number }
  | { type: 'spacechange'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'keyPress'; keyCode: string; modifiers?: string[]; reset?: boolean }
  | { type: 'mousedown' | 'mouseup' | 'click' | 'rightclick' | 'doubleclick' }
  | { type: 'echo'; msg: string };

export const sendMessageWrapper = (ws: React.RefObject<WebSocket | null>) => 
(message: MessagePayload) => {
  if (ws.current && ws.current.readyState === WebSocket.OPEN) {
    let messageToSend: object = message;

    if (message.type === 'mousemove' || message.type === 'scroll' || message.type === 'threefingerdrag') {
      let finalDx: number | undefined = message.dx;
      let finalDy: number | undefined = message.dy;

      if (message.type === 'mousemove') {
        finalDx = message.dx * SENSITIVITY_FACTOR;
        finalDy = message.dy * SENSITIVITY_FACTOR;
      } else if (message.type === 'scroll' || message.type === 'threefingerdrag') {
        finalDx = message.dx * SCROLL_SENSITIVITY_FACTOR;
        finalDy = message.dy * SCROLL_SENSITIVITY_FACTOR;
      }
      
      messageToSend = {
        ...message,
        dx: finalDx,
        dy: finalDy,
      };
    }
    console.log({messageToSend})
    ws.current.send(JSON.stringify(messageToSend));
  } else {
    console.log('WebSocket not open. Current state:', ws.current?.readyState);
  }
};