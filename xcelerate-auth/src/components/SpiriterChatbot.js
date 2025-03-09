import React, { useState } from "react";

const SpiriterChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to the chat
    setMessages([...messages, { text: input, sender: "user" }]);

    // Send query to the backend
    try {
      const response = await fetch("/api/spiriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      setMessages([...messages, { text: input, sender: "user" }, { text: data.message, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
    }

    // Clear input
    setInput("");
  };

  return (
    <div className="spiriter-chatbot">
      <h2>Spiriter Chatbot</h2>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default SpiriterChatbot;