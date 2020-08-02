const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StreamChat } = require("stream-chat");
const axios = require("axios").default;

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const streamClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

async function getPreviousTranscript(leadId) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
  }
  const response = await axios.get(
    `https://api.getbase.com/v2/leads/${leadId}`,
    { headers: headers }
  );
  return response.data.data.description || '';
}

app.put('/transcript', async (req, res) => {
  try {
    const leadId = req.body.leadId;
    let previousTranscript = await getPreviousTranscript(leadId);
    const payload = {
      'description': `${previousTranscript}\n${req.body.author}: ${req.body.message.text}`
    }
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }
    await axios.put(
      'https://api.getbase.com/v2/leads/' + leadId,
      { data: payload },
      { headers: headers }
    );
    res.send({});
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.post("/stream-chat-credentials", async (req, res) => {
  const { username, isSalesAdmin } = req.body;
  try {
    let user = { id: username, name: username, role: 'user' };

    await streamClient.upsertUsers([user]);
    const channel = streamClient.channel('messaging', username, {
      name: 'Sales Chat',
      created_by_id: 'sales-admin'
    });

    await channel.create();
    await channel.addMembers([username]);

    const token = streamClient.createToken(user.id);

    res.send({
      userId: user.id,
      userName: user.name,
      channelId: channel.id,
      token,
      apiKey: process.env.STREAM_API_KEY
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
});
