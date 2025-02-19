import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import Button from "./reusables/Button";
import { motion } from "framer-motion";
import TypingMessage from "./reusables/TypingMessage";
import PropTypes from "prop-types";
import { toast } from "sonner";
import AnimatedSection from "./reusables/AnimatedSection";

const supportedLanguages = [
    {
        option: "English (en)",
        value: "en",
    },
    {
        option: "French (fr)",
        value: "fr",
    },
    {
        option: "Portuguese (pt)",
        value: "pt",
    },
    {
        option: "Russian (ru)",
        value: "ru",
    },
    {
        option: "Spanish (es)",
        value: "es",
    },
    {
        option: "Turkish (tr)",
        value: "tr",
    },
];

function ChatInterface({ selectedTheme, setMessages, messages }) {
    // const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("French");
    const [currentTransLanguage, setCurrentTransLanguage] = useState("");
    const textRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem("currentMessages");
        if (!savedMessages) return;
        setMessages(JSON.parse(savedMessages));
    }, []);

    useEffect(() => {
        localStorage.setItem("currentMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    });

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                text: input,
                sender: "user",
                detectedLanguage: "",
            },
        ]);
        setInput("");
        if (textRef.current) {
            textRef.current.style.height = "auto";
        }
        try {
            console.log("detecting language api call");
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1].detectedLanguage =
                    "English";
                return updatedMessages;
            });
            setDetectedLanguage("English");
            toast.success("Language detection successful");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while detecting language");
        }
    };

    const summarizeText = (message) => {
        if (message.detectedLanguage !== "English") {
            toast.error("We only summarize English texts");
            return;
        }
        try {
            const indexOfAIResponse = messages.findIndex(
                (msg) => msg.summarizedId === message.id
            );
            if (indexOfAIResponse !== -1) {
                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    updatedMessages[indexOfAIResponse] = {
                        ...updatedMessages[indexOfAIResponse],
                        text: "Here is the updated summary...",
                    };
                    return updatedMessages;
                });
                console.log(messages, "updated messages");
                toast.success("Summarized text updated Successfully");
                return;
            }
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    text: "Summarized text",
                    sender: "AI",
                    summarizedId: message.id,
                },
            ]);
            console.log(messages, "updated messages");
            toast.success("Summarized text Successfully");
        } catch (error) {
            toast.error("An error occurred while summarizing text");
            console.error(error);
        }
    };

    function autoExpand(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    return (
        <div className="absolute inset-0 flex flex-col max-h-[calc(100vh - 65px)]">
            <div className="max-w-[780px] mx-auto w-full h-full flex flex-col px-4 lg:px-0 relative">
                {/* Messages container with fixed height and scroll */}
                <div
                    className="flex-1 overflow-y-auto min-h-0 relative mb-24"
                    ref={chatRef}
                >
                    <div className="absolute inset-0 lg:px-5 pb-5">
                        <div className="py-4 space-y-4 relative h-full">
                            {messages.length === 0 && (
                                <AnimatedSection>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center ">
                                            Welcome, let&apos;s get started!
                                        </h1>
                                    </div>
                                </AnimatedSection>
                            )}
                            {messages?.map((msg) => {
                                return (
                                    <div key={msg.id}>
                                        <motion.article
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                            className={`rounded-lg ${
                                                msg.sender === "user"
                                                    ? `ml-auto flex flex-col max-w-[250px]  sm:max-w-sm`
                                                    : ""
                                            }`}
                                        >
                                            <p
                                                className={`rounded-lg ${
                                                    msg.sender === "user"
                                                        ? ` ${
                                                              selectedTheme ===
                                                              "Neural Nexus"
                                                                  ? "shadow-lg shadow-teal-300/30"
                                                                  : " "
                                                          } chat-bubble p-3`
                                                        : ""
                                                }`}
                                            >
                                                {msg.sender === "AI" ? (
                                                    <TypingMessage
                                                        text={msg.text}
                                                    />
                                                ) : (
                                                    msg.text
                                                )}
                                            </p>
                                            {msg.sender === "user" && (
                                                <span className="text-xs italic">
                                                    Detected Language:{" "}
                                                    {msg.detectedLanguage}
                                                </span>
                                            )}
                                        </motion.article>
                                        {msg.sender === "user" && (
                                            <div className="mt-5 w-full flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
                                                {msg.text.length > 150 && (
                                                    <Button
                                                        onClick={() =>
                                                            summarizeText(msg)
                                                        }
                                                        className="action-button"
                                                    >
                                                        Summarize
                                                    </Button>
                                                )}
                                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                                    <select
                                                        className="select-container focus:outline-none"
                                                        name="language"
                                                        id="language-select"
                                                        defaultValue=""
                                                    >
                                                        {/* Default placeholder option */}
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Select Language
                                                        </option>

                                                        {/* Mapping supported languages */}
                                                        {supportedLanguages.map(
                                                            (
                                                                language,
                                                                index
                                                            ) => (
                                                                <option
                                                                    value={
                                                                        language.value
                                                                    }
                                                                    key={index}
                                                                >
                                                                    {
                                                                        language.option
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    <Button className="action-button">
                                                        Translate
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Input area fixed at bottom */}
                <div className="input-container absolute bottom-2 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-0 w-[95%] md:w-full max-h-[200px]">
                    <div className="flex items-center gap-2">
                        <textarea
                            ref={textRef}
                            className="flex-1 p-2 focus:outline-none resize-none overflow--y-auto max-h-[150px]"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows="1"
                            onInput={(e) => autoExpand(e.target)}
                            placeholder="Type a message..."
                        />
                        <Button
                            onClick={sendMessage}
                            className=" p-2 rounded-full"
                        >
                            <IoIosSend size={25} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ChatInterface.propTypes = {
    selectedTheme: PropTypes.string,
    messages: PropTypes.array,
    setMessages: PropTypes.func,
};

export default ChatInterface;
