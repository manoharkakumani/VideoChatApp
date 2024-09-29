import React from "react";
import { motion } from "framer-motion";
import { FiPhoneOff } from "react-icons/fi";

const OutGoingCall = ({ friend, onCancel }) => {
  return (
    <div className="flex flex-col h-screen m-5 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <img
              src={friend.avatar || "https://via.placeholder.com/100"}
              alt={friend.name}
              className="w-16 h-16 rounded-full object-cover border-4 border-indigo-300"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {friend.friend.name}
            </h2>
            <p className="text-sm text-gray-500">
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
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Calling</h3>
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-indigo-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center"
          onClick={onCancel}
        >
          <FiPhoneOff className="mr-2 h-5 w-5" />
          End Call
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OutGoingCall;
