import Axios from "axios";
import React, { useState, useEffect } from "react";
import "../../App.css";
import NewChat from "./NewChat";
import ChatBox from "../ChatBox/ChatBox";
import MailIcon from "@mui/icons-material/Mail";
import { Badge, Button, Paper, Stack, Typography } from "@mui/material";

function App() {
  const [viewMode, setViewMode] = React.useState(true);
  const baseUrl = import.meta.env.VITE_API_URL;
  const [conversations, setConversations] = React.useState([]);
  const [selectedMessage, setSelectedMessage] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [showRequests, setShowRequests] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://13.234.17.247:8080");
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received relevant message:", message);
      if (message.requestStatus) {
        getConversations();
      }
    };
  }, []);

  useEffect(() => {
    const pendingConversations = conversations.filter((conversation) => conversation.requestStatus === "PENDING");
    setPendingCount(pendingConversations.length);
  }, [conversations]);

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      setCurrentUser(user);
      Axios.get(`${baseUrl}/conversation/${user._id}`).then((res) => {
        console.log(res);
        setConversations(res.data);
      });
    }
  };

  const acceptRequest = async (chat) => {
    Axios.get(`${baseUrl}/markAccepted/${chat._id}`).then((res) => {
      getConversations();
    });
  };

  return (
    <div className="App">
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <span></span>
        <button
          className="register-button"
          onClick={() => {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("user");

            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
      <NewChat currentUser={currentUser} />
      {selectedMessage ? (
        <>
          <ChatBox currentUser={currentUser} selectedMessage={selectedMessage} back={() => setSelectedMessage(null)} />
        </>
      ) : (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "5px" }}>
          <div className="company-card" style={{ width: "80%", alignItems: "center" }}>
            <Paper sx={{ padding: 2, background: "#bfbfbf" }}>
              <Paper onClick={() => setShowRequests(!showRequests)} sx={{ padding: 3, mb: 1, cursor: "pointer", display: "flex", justifyContent: "space-between", background: "#bfbfbf" }}>
                <Typography>Message Requests</Typography>
                <Stack spacing={4} direction="row" sx={{ color: "action.active" }}>
                  <Badge color="secondary" badgeContent={pendingCount} showZero>
                    <MailIcon />
                  </Badge>
                </Stack>
              </Paper>
              {showRequests &&
                conversations.map((chat) => {
                  if (chat?.requestStatus === "PENDING")
                    return (
                      <>
                        <Paper elevation={3} sx={{ padding: 3, mb: 1, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                          <div>{currentUser.name === chat.fromName ? chat.toName : chat.fromName}</div>
                          <div>
                            <Button onClick={() => acceptRequest(chat)}>Accept</Button>
                          </div>
                        </Paper>
                      </>
                    );
                })}
            </Paper>
            {conversations.map((chat) => {
              if (chat?.requestStatus !== "PENDING")
                return (
                  <>
                    <Paper onClick={() => setSelectedMessage(chat)} elevation={3} sx={{ padding: 3, mb: 1, cursor: "pointer" }}>
                      <div>{currentUser.name === chat.fromName ? chat.toName : chat.fromName}</div>
                    </Paper>
                  </>
                );
            })}
          </div>
        </div>
      )}
      <div className="container">
        <br />
      </div>
    </div>
  );
}

export default App;
