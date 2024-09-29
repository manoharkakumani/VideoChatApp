// src/components/Tabs.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../store/tabSlice";

const Tabs = () => {
  const activeTab = useSelector((state) => state.tab).activeTab;

  const dispatch = useDispatch();
  return (
    <div className="flex border-b">
      <button
        className={`flex-1 py-2 ${
          activeTab === "chats" ? "border-b-2 border-blue-500" : ""
        }`}
        onClick={() => dispatch(setActiveTab("chats"))}
      >
        Chats
      </button>
      <button
        className={`flex-1 py-2 ${
          activeTab === "friends" ? "border-b-2 border-blue-500" : ""
        }`}
        onClick={() => dispatch(setActiveTab("friends"))}
      >
        Friends
      </button>
    </div>
  );
};
export default Tabs;
