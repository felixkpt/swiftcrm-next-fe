'use client'
import { WebSocketProvider } from "@/app/context/WebSocketProvider";
import AutoToastNotification from "../Autos/AutoToastNotification";
import CookiesPolicy from "./CookiesPolicy";
import { useEffect, useState } from "react";

const Footer = () => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/notifications`);
    setWs(socket);

    socket.onmessage = function (event) {
      const messages = document.getElementById('messages');
      const message = document.createElement('li');
      const content = document.createTextNode(event.data);
      message.appendChild(content);
      messages.appendChild(message);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const input = document.getElementById("messageText");
    if (ws && input.value) {
      ws.send(input.value);
      input.value = '';
    }
  };

  return (
    <WebSocketProvider>
      <div className="container mt-3">
        <h1>FastAPI WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form onSubmit={sendMessage}>
          <input type="text" className="form-control" id="messageText" autoComplete="off" />
          <button className="btn btn-outline-primary mt-2" type="submit">Send</button>
        </form>
        <ul id='messages' className="mt-5"></ul>
      </div>
      <div className="relative">
        <div className="d fixed bottom-0 right-0 mb-2 me-2">
          <CookiesPolicy />
        </div>
        <footer className="footer p-10 bg-base-200 text-base-content">
          {/* Footer content */}
        </footer>
        <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
          {/* Footer content */}
        </footer>
        <AutoToastNotification />
      </div>
    </WebSocketProvider>
  );
};

export default Footer;
