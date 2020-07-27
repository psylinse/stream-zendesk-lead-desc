import React, { useState } from "react";

import SalesChat from "./SalesChat";

function App() {
  const [username, setUsername] = useState('');
  const [leadId, setLeadId] = useState('');
  const [isSalesAdmin, setIsSalesAdmin] = useState(null);

  if (username && leadId && isSalesAdmin !== null) {
    return <SalesChat username={username} leadId={leadId} isSalesAdmin={isSalesAdmin}/>;
  } else {
    return <div className="login">
      <div className="login-description">
        Type in a username to chat with. If you'd like to view the sales admin side of the chat be sure to hit the 'Login
        as Sales Admin' button.
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
      <button onClick={() => setIsSalesAdmin(false)}>Login as Customer</button>
      <button onClick={() => setIsSalesAdmin(true)}>Login as Sales Admin</button>
    </div>
  }
}

export default App;
