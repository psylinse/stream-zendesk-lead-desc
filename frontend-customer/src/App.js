import React, { useEffect, useState } from "react";
import {
  Channel,
  Chat,
  MessageCommerce,
  MessageInput,
  MessageInputFlat,
  MessageList,
  TypingIndicator,
  Window
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

function Customer() {
  const [channel, setChannel] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const username = "customer";

    async function getToken() {
      try {
        const response = await axios.post("http://localhost:7000/join", {
          username
        });
        const token = response.data.token;
        const channelId = response.data.channelId;
        const chatClient = new StreamChat(response.data.api_key);

        await chatClient.setUser(
          {
            id: username,
            name: "Customer"
          },
          token
        );

        const channel = chatClient.channel("messaging", channelId);

        setChannel(channel);
        setChatClient(chatClient);
      } catch (err) {
        console.error(err);
        return <div>{err}</div>;
      }
    }

    getToken();
  }, []);

  async function handleMessage(channelId, message) {
    await axios.put("http://localhost:7000/updateDesc", { message, author: 'Customer' });
    return channel.sendMessage(message);
  }

  return (
    <Chat client={chatClient} theme="commerce light">
      <Channel channel={channel} doSendMessageRequest={handleMessage}>
        <Window>
          <div>
            Customer Support Chat: Customer View
          </div>
          <MessageList
            typingIndicator={TypingIndicator}
            Message={MessageCommerce}
          />
          <MessageInput Input={MessageInputFlat} focus/>
        </Window>
      </Channel>
    </Chat>
  );
}

export default Customer;
