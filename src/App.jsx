import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./index.css";
import sunIcon from "./assets/sun.png";
import moonIcon from "./assets/moon.png";
import logoWhite from "./assets/white-logo.png";
import logoBlack from "./assets/black-logo.png";

// Connect to the backend server
const socket = io.connect("http://localhost:5000");

const App = () => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const joinChat = () => {
    if (username !== "") {
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        author: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      } flex justify-center items-center transition-colors`}
    >
      <img
        src={darkMode ? logoWhite : logoBlack}
        alt="Logo"
        className="absolute top-6 left-6 w-40 h-6"
      />

      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded ${darkMode ? "bg-gray-500 text-white" : "bg-gray-400 text-gray-900"
        }`}
      >
        <img
          src={darkMode ? sunIcon : moonIcon}
          alt="Toggle Dark Mode"
          className="w-6 h-6"
        />
      </button>

      {!joined ? (
        <div
          className={`w-full max-w-md p-6 ${
            darkMode ? "dark bg-gray-700" : "bg-white"
          } shadow-lg rounded-lg`}
        >
          <h1
            className={`text-3xl font-bold text-center mb-6 text-gray-700 ${
              darkMode ? "dark bg-gray-700 text-white" : ""
            }`}
          >
            Join the Chat
          </h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            onClick={joinChat}
          >
            Join
          </button>
        </div>
      ) : (
        <div className="chat-window w-full max-w-lg  shadow-lg rounded-lg ">
          <div className="chat-header bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-4 rounded-t-lg flex justify-between items-center">
            <p className="font-bold text-lg">Live Chat - {username}</p>
            <span className="text-xs text-gray-200">
              Logged in as: {username}
            </span>
          </div>
          <div
            className={`chat-body p-4 h-96 overflow-y-auto space-y-4 bg-gray-50 ${
              darkMode ? "dark bg-gray-700" : "bg-white"
            }`}
          >
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={`message flex items-start ${
                  msg.author === username ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                    msg.author === username
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="text-xs text-gray-300">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`chat-footer flex p-4  rounded-b-lg ${
              darkMode ? "dark bg-gray-700" : "bg-white"
            }`}
          >
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-900 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;