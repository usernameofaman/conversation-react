import axios from "axios";
import React, { useState } from "react";
import "./NewChat.css";

const PopoverSearchList = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sendBox, showSendBox] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [messageToSend, setMessageToSend] = useState("");

  const getConversations = async (nameFilter) => {
    if (!nameFilter || nameFilter === "") return;
    const baseUrl = import.meta.env.VITE_API_URL;

    axios.get(`${baseUrl}/filterUser/${nameFilter}`).then((res) => {
      setSearchResults(res.data);
    });
  };

  React.useEffect(() => {
    getConversations(searchQuery);
  }, [searchQuery]);

  const sendMessage = async () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    let user = localStorage.getItem("user");
    if (user) user = JSON.parse(user);
    if (!user._id) {
      window.alert("Something Went Wrong");
      return;
    }

    axios
      .post(`${baseUrl}/conversation`, {
        from: user._id,
        to: selectedName?._id,
        fromName: user.name,
        toName: selectedName?.name,
        message: messageToSend,
      })
      .then((res) => {
        if (res.data._id) window.alert("Message Sent");
        showSendBox(false);
      });
  };

  return (
    <>
      <div className="popover-container">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." />
        {searchQuery && (
          <div className="popover">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => {
                if (result._id !== currentUser._id)
                  return (
                    <div
                      onClick={() => {
                        showSendBox(true);
                        setSelectedName(result);
                        setSearchQuery(null);
                      }}
                      className="search-result"
                      key={index}
                    >
                      {result?.name}
                    </div>
                  );
              })
            ) : (
              <div className="no-results">No results found</div>
            )}
          </div>
        )}
      </div>
      {sendBox && (
        <div style={{ marginTop: "30px", display: "flex", flexDirection: "column" }}>
          To : {selectedName?.name}
          <div>
            Message :{" "}
            <input
              placeholder="Message"
              value={messageToSend}
              onChange={(e) => setMessageToSend(e.target.value)}
            />
          </div>
          <div>
            <button onClick={() => sendMessage()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopoverSearchList;
