import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

function ChatInterface() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How are you?", sender: "other" },
        { id: 2, text: "I'm good! What about you?", sender: "me" },
        { id: 3, text: "I'm good! What about you?", sender: "me" },
        { id: 4, text: "I'm good! What about you?", sender: "me" },
        { id: 5, text: "I'm good! What about you?", sender: "me" },
        { id: 6, text: "I'm good! What about you?", sender: "me" },
        { id: 7, text: "I'm good! What about you?", sender: "me" },
        { id: 8, text: "I'm good! What about you?", sender: "me" },
        { id: 9, text: "I'm good! What about you?", sender: "me" },
        { id: 10, text: "I'm good! What about you?", sender: "me" },
        { id: 11, text: "I'm good! What about you?", sender: "me" },
        { id: 12, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
        { id: 13, text: "I'm good! What about you?", sender: "me" },
    ]);
    const [input, setInput] = useState("");
    return (
      <div className="absolute inset-0 flex flex-col max-h-[calc(100vh - 65px)]">
          <div className="max-w-[768px] mx-auto w-full h-full flex flex-col px-4 lg:px-0">
              {/* Messages container with fixed height and scroll */}
              <div className="flex-1 overflow-y-auto min-h-0 relative">
                  <div className="absolute inset-0 overflow-y-auto">
                      <div className="py-4 space-y-4">
                          {messages.map((msg) => (
                              <article
                                  key={msg.id}
                                  className={`p-3 max-w-xs rounded-lg text-white ${
                                      msg.sender === "me"
                                          ? "bg-blue-500 ml-auto"
                                          : "bg-gray-500"
                                  }`}
                              >
                                  {msg.text}
                              </article>
                          ))}
                      </div>
                  </div>
              </div>
              {/* Input area fixed at bottom */}
              <div className="py-4 border-t bg-white">
                  <div className="flex items-center gap-2">
                      <input
                          type="text"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type a message..."
                      />
                      <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                          <IoIosSend size={20} />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default ChatInterface;
