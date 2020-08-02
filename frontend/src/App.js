import React, { useState } from "react";

import SalesChat from "./SalesChat";
import axios from "axios";
import { StreamChat } from "stream-chat";

function App() {
  const [username, setUsername] = useState('');
  const [leadId, setLeadId] = useState('');
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  const startChat = async () => {
    const response = await axios.post("http://localhost:8080/stream-chat-credentials", {
      username, leadId
    });
    const token = response.data.token;
    const channelId = response.data.channelId;
    const chatClient = new StreamChat(response.data.apiKey);

    await chatClient.setUser({ id: response.data.userId, name: response.data.userName }, token);
    const channel = chatClient.channel("messaging", channelId);

    setChatClient(chatClient);
    setChannel(channel);
  }

  if (channel && chatClient) {
    return <SalesChat username={username} leadId={leadId} channel={channel} chatClient={chatClient}/>;
  } else {
    return <div className="login">
      <div className="login-description">
        Type in a username and start a chat to simulate a Customer's sales chat experience. Be sure to grab a Lead ID from Zendesk Sell.
      </div>
      <label>Customer Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <label>Zendesk Lead ID</label>
      <input
        type="text"
        value={leadId}
        onChange={(e) => setLeadId(e.target.value)}
        required
      />
      <button onClick={startChat}>Start Sales Chat</button>
    </div>
  }
}

export default App;
