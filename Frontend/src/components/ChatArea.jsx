import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { WebSocketContext } from "../context/WebSocketProvider";
import { getChatById } from "../api/api";

const ChatArea = ({ friend, onBack, onVideoCall }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const auth = useSelector((state) => state.auth);
  const { ws, sendMessages } = useContext(WebSocketContext);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await getChatById(friend.chat._id);
      if (response.status === 200) {
        setMessages(response.data.messages);
      } else {
        console.error("Failed to fetch messages.");
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, [friend.chat._id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (ws) {
      const handleMessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.chatId === friend.chat._id) {
          setMessages((prevMessages) => [...prevMessages, message.message]);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws, friend.chat._id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && sendMessages) {
      const messageData = {
        channel: "chat",
        chatId: friend.chat._id,
        userId: auth.user._id,
        toUserId: friend.friend._id,
        type: "text",
        content: {
          text: newMessage,
          language: auth.user.language,
        },
      };
      sendMessages(messageData);
      setNewMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b flex items-center">
        <button className="md:hidden mr-4" onClick={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <div className="font-semibold">{friend.friend.name}</div>
          <div className="text-sm text-gray-500">
            {friend.friend.isOnline
              ? "Online"
              : `Last seen ${new Date(
                  friend.friend.lastSeen
                ).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
          </div>
        </div>
        <button
          className="ml-auto text-white px-4 py-2 rounded"
          onClick={onVideoCall}
        >
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            width="25px"
            height="25px"
            viewBox="0 0 64 64"
            fill="#231F20"
          >
            <path
              d="M62.102,12.59c-1.176-0.73-2.645-0.793-3.891-0.176L48,17.516V12c0-2.211-1.789-4-4-4H4
	c-2.211,0-4,1.789-4,4v40c0,2.203,1.789,4,4,4h40c2.211,0,4-1.797,4-4v-5.535l10.211,5.105c0.566,0.281,1.176,0.422,1.789,0.422
	c0.73,0,1.461-0.199,2.102-0.598c1.18-0.73,1.898-2.016,1.898-3.402v-32C64,14.605,63.281,13.32,62.102,12.59z"
            />
          </svg>
        </button>
      </div>
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-gray-700">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender === auth.user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    message.sender === auth.user._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {message.type === "text" ? (
                    <p>{message.message.text.original.text}</p>
                  ) : message.type === "call" ? (
                    <p>Video call</p>
                  ) : (
                    <p>Unsupported message type</p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === auth.user._id
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <form onSubmit={handleSendMessage}>
        <div className="bg-white p-4 border-t flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;
