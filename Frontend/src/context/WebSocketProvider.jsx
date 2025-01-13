import React, { createContext, useEffect, useRef, useState } from "react";
import { socketURL } from "../api/api";
import { useSelector } from "react-redux";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  const wsRef = useRef(null);
  const timeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const [messages, setMessages] = useState([]);
  const [videoCallMessage, setVideoCallMessage] = useState(null);
  const [signalMessage, setSignalMessage] = useState(null);
  const heartbeatIntervalRef = useRef(null);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connectWebSocket = () => {
      if (user && !wsRef.current) {
        wsRef.current = new WebSocket(`${socketURL}/${user._id}`);

        wsRef.current.onopen = () => {
          console.log("WebSocket connection opened");
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts
          startHeartbeat();
        };

        wsRef.current.onmessage = (e) => {
          const message = JSON.parse(e.data);
          handleMessage(message);
        };

        wsRef.current.onerror = (e) => {
          console.log("WebSocket error:", e.message);
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket connection closed, retrying...");
          wsRef.current = null;
          stopHeartbeat();
          handleReconnect();
        };
      }
    };

    const handleReconnect = () => {
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const timeout = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30000); // Exponential backoff
        reconnectAttemptsRef.current += 1;
        timeoutRef.current = setTimeout(connectWebSocket, timeout);
      } else {
        console.log("Maximum reconnect attempts reached. Giving up.");
      }
    };

    const handleMessage = (message) => {
      switch (message.channel) {
        case "chat":
          setMessages((prevMessages) => [...prevMessages, message]);
          break;
        case "video":
          setVideoCallMessage(message);
          break;
        case "signal":
          setSignalMessage(message);
          break;
        default:
          console.log("Unknown message type:", message);
      }
    };

    const startHeartbeat = () => {
      heartbeatIntervalRef.current = setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000); // Send a ping every 30 seconds
    };

    const stopHeartbeat = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };

    if (user) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopHeartbeat();
    };
  }, [user]);

  const sendMessages = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      message.sender = user._id;
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.log("WebSocket not open. Unable to send message:", message);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        ws: wsRef.current,
        sendMessages,
        messages,
        videoCallMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
