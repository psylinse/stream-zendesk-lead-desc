require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StreamChat } = require("stream-chat");
const { response } = require("express");
const axios = require("axios").default;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize Stream Chat SDK
const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

app.get("/getleads", async (req, res) => {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads',
        {headers: headers}
    );
    // console.log(response.data.items);
    res.send(response.data.items);
  } catch (err) {
    console.log(err);
    res.status(500);
}});

const leadId = '2011047977'

app.get("/getLeadDesc", async (req, res) => {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads/' + leadId,
        {headers: headers}
    );
    // console.log(response.data.data);
    res.send(response.data.data.description);
  } catch (err) {
    console.log(err);
    res.status(500);
}});

async function getLeadDesc(req, res) {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads/' + leadId,
        {headers: headers}
    );
    // console.log(response.data.data);
    return response.data.data.description;
  } catch (err) {
    console.log(err);
    res.status(500);
}};

app.put('/updateDesc', async (req, res) => {
  try {
      let leadDesc = await getLeadDesc(leadId);
      const payload = {
          'description': leadDesc += `\n${req.body.author}: ${req.body.message.text}`
        }
      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
      }        
      await axios.put(
          'https://api.getbase.com/v2/leads/' + leadId,
          {data: payload},
          {headers: headers}
      );
      res.send({});
  } catch (err) {
      console.log(err);
      res.status(500);
  }
});

app.post("/join", async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username
      },
      token
    );
    const admin = { id: "admin" };
    const channel = serverSideClient.channel("messaging", "livechat", {
      name: "Customer support",
      created_by: admin
    });

    await channel.create();
    await channel.addMembers([username]);
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});

app.listen(7000, () => {
  console.log(`Server running on PORT 7000`);
});
