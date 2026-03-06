import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);   // ✅ array default
  const [inputText, setInputText] = useState(""); // ✅ string default

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (socket) {
      socket.emit("ai-message", inputText);
    }

    setInputText("");
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    socketInstance.on("ai-message-response", (response) => {
      const botMessage = {
        id: Date.now(),
        text: response,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    });

    return () => socketInstance.disconnect(); // ✅ cleanup
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">🤖 ChatBOT</div>

      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user"
                  ? "user-message"
                  : "bot-message"
              }`}
            >
              <div className="message-content">
                <span className="message-text">{message.text}</span>
                <span className="message-timestamp">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;