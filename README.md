# Simple Video Chat App

A full-stack video and text-based chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with real-time communication capabilities enabled by WebRTC and WebSockets. This app allows users to engage in peer-to-peer video calls and instant messaging, providing a seamless, responsive chat experience.

## Features

- **Real-Time Communication**: Video calls and instant messaging between users using WebRTC and WebSockets.
- **Secure and Scalable**: Built with REST APIs and secure WebSocket connections for reliable performance.
- **Responsive UI**: Optimized for both desktop and mobile devices with a clean, user-friendly design.
- **Database Management**: MongoDB is used to store user data, chat histories, and other application states.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: WebRTC, WebSockets

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js official site](https://nodejs.org/).
- **MongoDB**: Make sure you have MongoDB installed and running locally, or use a cloud MongoDB instance (like MongoDB Atlas).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/manoharkakumani/VideoChatApp.git
   cd VideoChatApp
   ```

2. **Install Dependencies**

   Install the server-side dependencies:

   ```bash
   cd Backend
   npm install
   ```

   Install the client-side dependencies:

   ```bash
   cd ../Frontend
   npm install
   ```

3. ** Variables**
  - feel free to create .env and intgrate with project or edit the varibles in server.js in Backend.
  - PORT=5000
  - MONGO_URL
  

4. **Run the Application**

   Start the backend server:

   ```bash
   cd Backend
   npm run dev
   ```

   Start the frontend application:

   ```bash
   cd ../Frontend
   npm run dev
   ```

5. **Access the App**

   Open your browser and navigate to `http://localhost:<Port>` to use the application.

## Usage

- **Sign Up**: Register a new account using a unique username and password.
- **Login**: Sign in with your credentials.
- **Start Chatting**: Connect with other users, start video calls, or send instant messages.

## Screenshots
![Screenshot 2024-09-28 212300](https://github.com/user-attachments/assets/e845d06a-ce93-47e8-be77-c138f9745532)


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Manohar Kakumani**  
- **LinkedIn**: [linkedin.com/in/manoharkakumani](https://www.linkedin.com/in/manoharkakumani/)  
- **Email**: manoharkakumani@gmail.com

---

Feel free to adjust the screenshots section with actual images and update any additional setup instructions specific to your project!
  
