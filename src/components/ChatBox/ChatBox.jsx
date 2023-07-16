import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import "./ChatBox.css";

const ChatBox = ({ currentUser, selectedMessage, back }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = React.useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;

  const messagesRef = React.useRef(null);

  React.useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const socket = new WebSocket("ws://13.234.17.247:8080");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received relevant message:", message);
      if ((message.to === selectedMessage.to && message.from === selectedMessage.from) || (message.from === selectedMessage.to && message.to === selectedMessage.from)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };
  }, []);

  useEffect(() => {
    getAllMessages();
  }, [selectedMessage]);

  const getAllMessages = async () => {
    axios.get(`${baseUrl}/message/${selectedMessage.from}/${selectedMessage.to}`).then((res) => {
      setMessages(res.data);
    });
  };

  const handleSendMessage = () => {
    axios
      .post(`${baseUrl}/message`, {
        from: currentUser._id,
        to: currentUser?._id === selectedMessage.from ? selectedMessage.to : selectedMessage.from,
        message: newMessage,
      })
      .then((res) => {
        setNewMessage("");
      });
  };

  return (
    <div className="chat-box">
      <button onClick={back}>Back</button>
      <div ref={messagesRef} className="messages-container">
        {currentUser.name === selectedMessage.fromName ? selectedMessage.toName : selectedMessage.fromName}
        {messages.map((message) => (
          <div style={{ width: "300px", padding: "5px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  alignSelf: message.from === currentUser._id ? "flex-end" : "flex-start",
                  backgroundColor: message.from === currentUser._id ? "lightblue" : "lightgreen",
                  color: "white",
                  padding: "5px",
                  marginBottom: "5px",
                  borderRadius: "5px",
                }}
              >
                {message.message}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          onKeyPress={(event) => {
            if (event.key === "Enter") handleSendMessage();
          }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="button-chat" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
