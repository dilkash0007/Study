import { useState, useEffect, useCallback } from "react";

// WebSocket connection setup
export const setupWebSocket = (token: string) => {
  // Get the current hostname and port from the browser
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const hostname = window.location.hostname;
  const port = window.location.port || "5000"; // Default to 5000 if no port is specified

  // Create the WebSocket URL with the correct port
  const wsUrl = `${protocol}//${hostname}:${port}/socket?token=${token}`;

  try {
    const socket = new WebSocket(wsUrl);
    return socket;
  } catch (error) {
    console.error("Failed to connect to WebSocket:", error);
    return null;
  }
};

// Hook for WebSocket connection
export const useWebSocket = (token: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  // Connect to WebSocket
  useEffect(() => {
    const newSocket = setupWebSocket(token);

    if (newSocket) {
      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      setSocket(newSocket);

      // Clean up on unmount
      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  // Send message through WebSocket
  const sendMessage = useCallback(
    (data: any) => {
      if (socket && isConnected) {
        socket.send(JSON.stringify(data));
      }
    },
    [socket, isConnected]
  );

  return { isConnected, lastMessage, sendMessage };
};
