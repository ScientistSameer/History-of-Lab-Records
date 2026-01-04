export const startCollaborationAI = (task, onMessage) => {
    const ws = new WebSocket("ws://localhost:8001/collaboration-ai/ws");
  
    ws.onopen = () => {
      ws.send(JSON.stringify({ task }));
    };
  
    ws.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };
  
    return ws;
  };
  