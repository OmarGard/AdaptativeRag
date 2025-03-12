export const websocketMiddleware = (store: any) => {
    let socket: WebSocket | null = null;
  
    return (next: (action: any) => any) => (action: any) => {
      switch (action.type) {
        case "websocket/connect":
          if (!socket || socket.readyState === WebSocket.CLOSED) {
            socket = new WebSocket("ws://localhost:8000/ws");
  
            socket.onopen = () => {
              console.log("WebSocket Connected");
              store.dispatch({ type: "websocket/setConnected", payload: true });
            };
  
            socket.onmessage = (event) => {
              console.log("Message received:", event.data);
              store.dispatch({ type: "websocket/setMessage", payload: event.data });
            };
  
            socket.onclose = () => {
              console.log("WebSocket Disconnected");
              store.dispatch({ type: "websocket/setConnected", payload: false });
              socket = null;
            };
  
            socket.onerror = (error) => {
              console.error("WebSocket Error:", error);
            };
          }
          break;
  
        case "websocket/disconnect":
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
            socket = null;
            store.dispatch({ type: "websocket/setConnected", payload: false });
          }
          break;
  
        case "websocket/sendMessage":
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(action.payload);
          }
          break;
  
        default:
          break;
      }
  
      return next(action);
    };
  };
  