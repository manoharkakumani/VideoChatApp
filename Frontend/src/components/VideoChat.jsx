import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { getChatById } from "../api/api";
import { WebSocketContext } from "../context/WebSocketProvider";
import flip from "../assets/flip-camera.svg";
import microphone from "../assets/microphone.svg";
import mutephone from "../assets/mutephone.svg";
import speaker from "../assets/speaker.svg";
import speakerOff from "../assets/speaker1.svg";
import endCall from "../assets/end-call.svg";

const VideoChat = ({ friend, onBack }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const auth = useSelector((state) => state.auth);
  const { ws, sendMessages } = useContext(WebSocketContext);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [friend]);

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
        if (message.channel === "chat" && message.chatId === friend.chat._id) {
          setMessages((prevMessages) => [...prevMessages, message.message]);
        } else if (
          message.channel === "signal" &&
          message.fromUserId === friend.friend._id
        ) {
          handleSignalingData(message);
        }
      };

      ws.addEventListener("message", handleMessage);

      return () => {
        ws.removeEventListener("message", handleMessage);
      };
    }
  }, [ws, friend.chat._id, friend.friend._id]);

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

  const handleSignalingData = async (data) => {
    switch (data.type) {
      case "offer":
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(answer)
        );
        sendMessages({
          channel: "signal",
          type: "answer",
          answer,
          toUserId: friend.friend._id,
          fromUserId: auth.user._id,
        });
        break;
      case "answer":
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        break;
      case "candidate":
        if (data.candidate) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
        break;
      default:
        break;
    }
  };

  const startCall = async () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN server here if needed
      ],
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessages({
          channel: "signal",
          type: "candidate",
          candidate: event.candidate,
          toUserId: friend.friend._id,
          fromUserId: auth.user._id,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Function to start the webcam
    async function initializeWebcam() {
      // Define getWebcam as a fallback for older browsers
      let currentStream = null;
      navigator.getWebcam =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request access to video and audio using the modern API
          currentStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          // Display the video stream in the video element
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = currentStream;
          }

          // Add each track to the peer connection if needed
          currentStream.getTracks().forEach((track) => {
            if (peerConnectionRef.current) {
              peerConnectionRef.current.addTrack(track, currentStream);
            }
          });
        } catch (error) {
          console.error(`${error.name}: ${error.message}`);
        }
      } else if (navigator.getWebcam) {
        // Fallback for older browsers
        navigator.getWebcam(
          { video: true, audio: true },
          function (stream) {
            currentStream = stream;

            // Display the video stream in the video element
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = currentStream;
            }

            // Add each track to the peer connection if needed
            currentStream.getTracks().forEach((track) => {
              if (peerConnectionRef.current) {
                peerConnectionRef.current.addTrack(track, currentStream);
              }
            });
          },
          function (error) {
            console.error("Webcam is not accessible:", error);
          }
        );
      } else {
        console.error("getUserMedia is not supported in this environment.");
      }
    }
    initializeWebcam();
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(
      new RTCSessionDescription(offer)
    );
    sendMessages({
      channel: "signal",
      type: "offer",
      offer,
      toUserId: friend.friend._id,
      fromUserId: auth.user._id,
    });
  };
  // Function to stop the webcam
  function stopWebcam() {
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  useEffect(() => {
    if (callStarted) {
      startCall();
    }

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [callStarted]);

  useEffect(() => {
    setCallStarted(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video area */}
        <div className="flex-1 bg-black relative">
          {/* Main video (remote user) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            {...(!isSpeakerOn && { muted: true })} // Mute if user is muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Self video */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="absolute top-4 right-4 w-1/4 h-1/4 bg-gray-800 border-2 border-white rounded-lg overflow-hidden"
          />
          {/* Call controls */}
          <div className="flex space-x-4 sm:space-x-6 absolute bottom-4 inset-x-0 justify-center">
            <button
              className="bg-red-500 text-white p-3 sm:p-4 rounded-full hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
              onClick={() => {
                stopWebcam();
                onBack();
              }}
            >
              <img
                src={endCall}
                alt="end call"
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </button>
            <button
              className="bg-gray-700 text-white p-3 sm:p-4 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
              onClick={() => setIsSpeakerOn((prev) => !prev)}
            >
              {isSpeakerOn ? (
                <img
                  src={speaker}
                  alt="speaker"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              ) : (
                <img
                  src={speakerOff}
                  alt="speaker off"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              )}
            </button>
            <button
              className="bg-gray-700 text-white p-3 sm:p-4 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
              onClick={() => setIsMuted((prev) => !prev)}
            >
              {isMuted ? (
                <img
                  src={mutephone}
                  alt="microphone"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              ) : (
                <img
                  src={microphone}
                  alt="microphone mute"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              )}
            </button>
            <button className="bg-gray-700 text-white p-3 sm:p-4 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-110 shadow-lg">
              <img
                src={flip}
                alt="flip camera"
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="h-1/3 bg-white border-t flex flex-col overflow-hidden">
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
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex items-center">
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
      </div>
    </div>
  );
};

export default VideoChat;
