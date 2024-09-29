import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { SignIn, SignUp, Home } from "../screens";

import { useSelector } from "react-redux";

import { WebSocketProvider } from "../context/WebSocketProvider";

const Navigation = () => {
  // const [selectedFriend, setSelectedFriend] = useState(null);
  // const [isSignUp, setIsSignUp] = useState(false);

  const auth = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              auth.user ? (
                <WebSocketProvider>
                  <Home />
                </WebSocketProvider>
              ) : (
                <SignIn />
              )
              // <div>
              //   <SignIn />
              //   {/* {isSignUp ? <SignUp /> : <SignIn />}
              //   <div className="flex justify-center mt-4">
              //     <button
              //       onClick={() => setIsSignUp(!isSignUp)}
              //       className="text-blue-500 hover:underline"
              //     >
              //       {isSignUp
              //         ? "Already have an account? Sign In"
              //         : "Don't have an account? Sign Up"}
              //     </button>
              //   </div> */}
              // </div>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <WebSocketProvider>
                <Home />
              </WebSocketProvider>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default Navigation;
