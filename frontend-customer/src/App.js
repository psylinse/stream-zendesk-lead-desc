import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  Window,
  TypingIndicator,
  MessageList,
  MessageCommerce,
  MessageInput,
  MessageInputFlat,
  withChannelContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";

import "stream-chat-react/dist/css/index.css";

let chatClient;

function Customer() {
  document.title = "Customer service";
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const username = "customer";
    async function getToken() {
      try {
        const response = await axios.post("http://localhost:7000/join", {
          username
        });
        console.log(response.data.token);
        const token = response.data.token;
        chatClient = new StreamChat(response.data.api_key);

        chatClient.setUser(
          {
            id: username,
            name: "Customer"
          },
          token
        );

        const channel = chatClient.channel("messaging", "livechat", {
          name: "Customer Inquiry"
        });

        await channel.watch();
        setChannel(channel);
      } catch (err) {
        console.log(err);
        return;
      }
    }

    getToken();
  }, []);

  if (channel) {
    const CustomChannelHeader = withChannelContext(
      class CustomChannelHeader extends React.PureComponent {
        render() {
          return (
            <div className="str-chat__header-livestream">
              <div className="str-chat__header-livestream-left">
                <p className="str-chat__header-livestream-left--title">
                  Customer Support Chat
                </p>
              </div>
              <div className="str-chat__header-livestream-right">
                <div className="str-chat__header-livestream-right-button-wrapper">
                </div>
              </div>
            </div>
          );
        }
      }
    );
    
    async function handleMessage(channelId, message){
      let r1 = await axios.put("http://localhost:7000/updateDesc", {
          message,
          author:'Customer'
        });
      let r2 = await channel.sendMessage(message);
      return r2 + r1
    }

    return (
      <Chat client={chatClient} theme="commerce light">
        <Channel channel={channel} doSendMessageRequest={handleMessage}>
          <Window>
            <CustomChannelHeader />
            <MessageList
              typingIndicator={TypingIndicator}
              Message={MessageCommerce}
            />
            <MessageInput Input={MessageInputFlat} focus />
          </Window>
        </Channel>
      </Chat>
    );
  }

  return <div></div>;
}

export default Customer;