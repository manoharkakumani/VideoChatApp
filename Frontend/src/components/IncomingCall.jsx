import React from "react";
import { motion } from "framer-motion";
import { FiPhoneIncoming, FiPhoneOff } from "react-icons/fi";

const IncomingCall = ({ caller, onAccept, onDecline }) => {
  return (
    <div className="flex flex-col h-screen m-5  justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-4"
          >
            <img
              src={caller.avatar || "https://via.placeholder.com/100"}
              alt={caller.name}
              className="w-full h-full rounded-full object-cover border-4 border-green-300"
            />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {caller.name}
          </h2>
          <p className="text-lg text-gray-600">Incoming call</p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <motion.div
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition duration-300 ease-in-out flex items-center justify-center mr-2"
            onClick={onDecline}
          >
            <FiPhoneOff className="mr-2 h-5 w-5" />
            Decline
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition duration-300 ease-in-out flex items-center justify-center ml-2"
            onClick={onAccept}
          >
            <FiPhoneIncoming className="mr-2 h-5 w-5" />
            Accept
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default IncomingCall;
