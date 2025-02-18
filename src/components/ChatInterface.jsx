import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";

function ChatInterface({ selectedTheme }) {
    console.log(selectedTheme, "here");
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
    function autoExpand(textarea) {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = textarea.scrollHeight + "px"; // Expand dynamically
    }

    return (
        <div className="absolute inset-0 flex flex-col max-h-[calc(100vh - 65px)]">
            <div className="max-w-[780px] mx-auto w-full h-full flex flex-col px-4 lg:px-0 relative">
                {/* Messages container with fixed height and scroll */}
                <div className="flex-1 overflow-y-auto min-h-0 relative mb-20">
                    <div className="absolute inset-0 overflow-y-auto px-5">
                        <div className="py-4 space-y-4">
                            {messages.map((msg) => (
                                <article key={msg.id} className="max-w-xs ml-auto flex flex-col">
                                    <p
                                        className={`p-3 rounded-lg text-white ${
                                            msg.sender === "me"
                                                ? ` ${
                                                      selectedTheme ===
                                                      "Neural Nexus"
                                                          ? "shadow-lg shadow-teal-300/30"
                                                          : " "
                                                  } chat-bubble`
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {msg.text}
                                    </p>
                                    <span className="text-xs italic">Detected Language: {}</span>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Input area fixed at bottom */}
                <div className="input-container absolute bottom-2 left-0 w-full max-h-[200px]">
                    <div className="flex items-center gap-2">
                        <textarea
                            className="flex-1 p-2 focus:outline-none resize-none overflow--y-auto max-h-[150px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows="1"
                            onInput={(e) => autoExpand(e.target)}
                            placeholder="Type a message..."
                        />
                        <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                            <IoIosSend size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;
