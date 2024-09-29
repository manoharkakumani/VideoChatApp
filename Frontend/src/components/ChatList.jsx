import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getChats, getFriends, createChat } from "../api/api";
import { setActiveTab } from "../store/tabSlice";

const ChatList = ({ setSelectedChat }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = useSelector((state) => state.auth);

  const activeTab = useSelector((state) => state.tab).activeTab;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "chats") {
          const response = await getChats(auth.user._id);
          if (response.status === 200) {
            console.log(response.data);
            setItems(response.data);
          } else {
            setError("Failed to fetch data. Please try again.");
          }
        } else {
          const response = await getFriends(auth.user._id);
          if (response.status === 200) {
            setItems(response.data);
          } else {
            setError("Failed to fetch data. Please try again.");
          }
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, auth.user.id]);

  const handleSelectChat = async (item) => {
    console.log("Selecting chat:", item);
    if (activeTab === "friends") {
      // Check if the chat already exists
      if (!item.chat) {
        try {
          // Create a new chat
          console.log("Creating chat with:", item.friend._id);
        } catch (error) {
          console.error("Error creating chat:", error);
        }
      } else {
        // If chat already exists, just set it as selected
        setSelectedChat(item);

        dispatch(setActiveTab("chats"));
      }
    } else {
      setSelectedChat(item);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex justify-center items-center">
          <div
            className="w-4 h-4 bg-blue-500 rounded-full mx-2 animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full mx-2 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-4 h-4 bg-blue-500 rounded-full mx-2 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-y-auto">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center p-3 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectChat(item)}
        >
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
          {/* online */}
          <div
            className={`w-3 h-3 rounded-full relative bottom-3 right-7 ${
              item.friend.isOnline ? " bg-green-500 " : "bg-red-500"
            }`}
          ></div>
          <div>
            <div className="font-semibold">{item.friend.name}</div>
            <div className="text-sm text-gray-500">
              {activeTab === "chats"
                ? item.chat.lastMessage
                : item.friend.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
