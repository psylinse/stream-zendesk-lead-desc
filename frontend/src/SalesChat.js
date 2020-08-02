import React from "react";
import { Channel, Chat, MessageInput, MessageList, Window } from "stream-chat-react";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

function SalesChat({ username, leadId, chatClient, channel }) {
  async function handleMessage(_channelId, message) {
    await axios.put("http://localhost:8080/transcript", { message, author: username, leadId: leadId });
    return channel.sendMessage(message);
  }

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
}

export default SalesChat;
