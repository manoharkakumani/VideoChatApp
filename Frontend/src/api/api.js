import axios from "axios";

const API_BASE_URL = "https://<url>"; // Adjust this URL as per your backend setup

export const socketURL = "wss://<url>"; // Adjust this URL as per your backend setup

// User API
export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/signup`, userData);
    return response;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error;
  }
};

export const signIn = async (credentials) => {
  try {
    console.log(credentials);
    const response = await axios.post(
      `${API_BASE_URL}/user/signin`,
      credentials
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getFriends = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/friends/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
};

export const getChats = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/chats/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

// Chat API
export const createChat = async (chatData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, chatData);
    return response;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};

export const getChatById = async (chatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/${chatId}`);
    return response;
  } catch (error) {
    console.error("Error fetching chat:", error);
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/chat/${chatId}`);
    return response;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

// Message API
export const createMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/message`, messageData);
    return response;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/message/${chatId}`);
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessage = async (messageId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/message/${messageId}`);
    return response;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/message/${messageId}`);
    return response;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const getFriend = async (myId, friendId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/${myId}/friend/${friendId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching friend:", error);
    throw error;
  }
};
