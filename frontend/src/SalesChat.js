import React, { useEffect, useState } from "react";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

function SalesChat({ username, leadId, isSalesAdmin }) {
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    async function getToken() {
      try {
        const response = await axios.post("http://localhost:7000/stream-chat-credentials", {
          username, leadId, isSalesAdmin
        });
        const token = response.data.token;
        const channelId = response.data.channelId;
        const chatClient = new StreamChat(response.data.apiKey);

        await chatClient.setUser({ id: response.data.userId, name: response.data.userName }, token);
        const channel = chatClient.channel("messaging", channelId);

        setChatClient(chatClient);
        setChannel(channel);
      } catch (err) {
        console.error(err);
        return <div>{err}</div>;
      }
    }

    getToken();
  }, []);

  async function handleMessage(channelId, message) {
    await axios.put("http://localhost:7000/transcript", { message, author: username, leadId: leadId });
    return channel.sendMessage(message);
  }

  if (chatClient && channel) {
    return (
      <Chat client={chatClient} theme="commerce light">
        <Channel channel={channel} doSendMessageRequest={handleMessage}>
          <Window>
            <h1>
              Customer Support Chat: {channel.id}
            </h1>
            <MessageList/>
            <MessageInput focus/>
          </Window>
        </Channel>
      </Chat>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default SalesChat;
