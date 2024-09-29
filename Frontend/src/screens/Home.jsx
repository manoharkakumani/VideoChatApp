import React, { useState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  ChatArea,
  ChatList,
  Header,
  Tabs,
  VideoChat,
  IncomingCall,
  OutGoingCall,
} from "../components";
import { WebSocketContext } from "../context/WebSocketProvider";
import { getFriend } from "../api/api";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const { ws, sendMessages, videoCallMessage } = useContext(WebSocketContext);

  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChat, setSelectedChat] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  const fetchFriend = async (friendId) => {
    const response = await getFriend(auth.user._id, friendId);
    if (response.status === 200) {
      setSelectedChat(response.data);
    } else {
      console.error("Failed to fetch friend:", response.data);
    }
    return null;
  };

  const handleVideoCallIncoming = async (videoCallMessage) => {
    switch (videoCallMessage.type) {
      case "call":
        setIncomingCall(videoCallMessage);
        await fetchFriend(videoCallMessage.fromUserId);
        break;
      case "call-accepted":
        setCalling(false);
        setIsVideoCall(true);
        break;
      case "call-declined":
        setCalling(false);
        setIncomingCall(null);
        break;
      case "call-canceled":
        setIsVideoCall(false);
        setIncomingCall(null);
        break;
      case "call-ended":
        handleBack();
        break;
      default:
        console.log("Unknown video message:", videoCallMessage);
    }
  };

  useEffect(() => {
    if (videoCallMessage) {
      handleVideoCallIncoming(videoCallMessage);
    }
  }, [videoCallMessage]);

  const handleBack = () => {
    setIsVideoCall(false);
    setIncomingCall(null);
    setCalling(false);
  };

  const chatBack = () => {
    setSelectedChat(null);
  };

  const handleSelectChat = (chat) => {
    if (!isVideoCall) {
      setSelectedChat(chat);
    }
  };

  const handleVideoCall = () => {
    setCalling(true);
    sendMessages({
      channel: "video",
      type: "call",
      chatId: selectedChat.chat._id,
      fromUserId: auth.user._id,
      toUserId: selectedChat.friend._id,
    });
  };

  const handleAcceptCall = () => {
    setIsVideoCall(true);
    if (incomingCall) {
      sendMessages({
        channel: "video",
        type: "call-accepted",
        fromUserId: auth.user._id,
        toUserId: incomingCall.fromUser._id,
        messageId: incomingCall.messageId,
      });
      setIncomingCall(null);
    }
  };

  const handleDeclineCall = () => {
    if (incomingCall) {
      sendMessages({
        channel: "video",
        type: "call-declined",
        fromUserId: auth.user._id,
        toUserId: incomingCall.fromUser._id,
        messageId: incomingCall.messageId,
      });
    }
    handleBack();
  };

  const handleCancelCall = () => {
    if (selectedChat) {
      sendMessages({
        channel: "video",
        type: "call-canceled",
        fromUserId: auth.user._id,
        toUserId: selectedChat.friend._id,
      });
    }
    handleBack();
  };

  const handleEndCall = () => {
    if (selectedChat) {
      sendMessages({
        channel: "video",
        type: "call-ended",
        fromUserId: auth.user._id,
        toUserId: selectedChat.friend._id,
      });
    }
    handleBack();
  };

  return !auth.user ? (
    <Navigate to="/signin" />
  ) : (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div
        className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r ${
          selectedChat && "hidden md:block"
        }`}
      >
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ChatList activeTab={activeTab} setSelectedChat={handleSelectChat} />
      </div>

      {/* Right Chat Area */}
      <div
        className={`w-full md:w-2/3 lg:w-3/4 ${
          !selectedChat && "hidden md:block"
        }`}
      >
        {incomingCall ? (
          <IncomingCall
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
            caller={incomingCall.fromUser}
          />
        ) : calling ? (
          <OutGoingCall onCancel={handleCancelCall} friend={selectedChat} />
        ) : selectedChat ? (
          isVideoCall ? (
            <VideoChat friend={selectedChat} onBack={handleEndCall} />
          ) : (
            <ChatArea
              friend={selectedChat}
              onBack={chatBack}
              onVideoCall={handleVideoCall}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
