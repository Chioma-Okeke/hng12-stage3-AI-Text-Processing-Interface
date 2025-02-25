import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import Button from "./reusables/Button";
import { motion } from "framer-motion";
import TypingMessage from "./reusables/TypingMessage";
import PropTypes from "prop-types";
import { toast } from "sonner";
import AnimatedSection from "./reusables/AnimatedSection";
import { IoLanguageSharp } from "react-icons/io5";
import { FaBahai } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import {
    checkAIConfiguration,
    detectLanguage,
    textSummarization,
    textTranslation,
} from "../utils/apiServices";
import Spinner from "./reusables/Spinner";
import { supportedLanguages } from "../data/languages";

function ChatInterface({ selectedTheme, setMessages, messages }) {
    const [input, setInput] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [errorOn, setErrorOn] = useState("");
    const [isThereError, setIsThereError] = useState(false);
    const [currentId, setCurrentId] = useState("");
    const textRef = useRef(null);
    const [isSummarizationInProgress, setIsSummarizationInProgress] =
        useState("");
    const [isTranslationInProgress, setIsTranslationInProgress] =
        useState(false);
    const chatRef = useRef(null);
    const lastTranslationRef = useRef(null);
    const prevTranslationsCountRef = useRef({});
    const [showCopyIcon, setShowCopyIcon] = useState("");

    useEffect(() => {
        const savedMessages = localStorage.getItem("currentMessages");
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (error) {
                toast.error(
                    "something went wrong when getting messages from storage"
                );
                setMessages([]);
                console.error(error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("currentMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (chatRef.current && messages.length > 0) {
            setTimeout(() => {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }, 100);
        }
    }, [messages?.length]);

    useEffect(() => {
        messages.forEach((msg) => {
            const currentTranslationsCount = msg.translations?.length || 0;
            const prevCount = prevTranslationsCountRef.current[msg.id] || 0;

            if (
                currentTranslationsCount > prevCount &&
                lastTranslationRef.current
            ) {
                prevTranslationsCountRef.current[msg.id] =
                    currentTranslationsCount;
                setTimeout(() => {
                    lastTranslationRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    });
                }, 200);
            }
        });
    }, [messages]);

    useEffect(() => {
        localStorage.setItem("currentMessages", JSON.stringify(messages));
        if (messages?.length === 0) return;

        const latestMessage = messages[messages?.length - 1];
        if (
            latestMessage.sender === "user" &&
            !latestMessage.detectedLanguage
        ) {
            setLanguage(latestMessage);
        }
    }, [messages]);

    const setLanguage = async (message) => {
        try {
            const language = await detectLanguage(message.text);
            setMessages((prev) => {
                return prev.map((msg) =>
                    msg.id === message.id
                        ? { ...msg, detectedLanguage: language }
                        : msg
                );
            });
            toast.success("Language detection successful");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const sendMessage = async () => {
        const isAllowed = await checkAIConfiguration();
        if (!isAllowed || isAllowed === "Not Supported "){
            if (window.innerWidth < 1024) {
                toast.error(
                "AI features work best on the desktop version of Chrome."
            )} else {
                toast.error("You need to have the Chrome built-in AI configured. Visit help center for assistance on that")
            }
            return;
        }

        if (!input.trim()) {
            setIsThereError(true);
            toast.warning("Kindly enter your text in the input field.");
            return;
        }

        const newMessage = {
            id: messages.length + 1,
            text: input,
            sender: "user",
            detectedLanguage: "",
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        if (textRef.current) {
            textRef.current.style.height = "auto";
        }
    };

    const summarizeText = async (message) => {
        if (message.detectedLanguage !== "English") {
            toast.error("We only summarize English texts");
            return;
        }
        try {
            setIsSummarizationInProgress(message.id);
            const summarizedText = await textSummarization(message.text);
            const indexOfAIResponse = messages.findIndex(
                (msg) => msg.summarizedId === message.id
            );
            if (indexOfAIResponse !== -1) {
                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    updatedMessages[indexOfAIResponse] = {
                        ...updatedMessages[indexOfAIResponse],
                        text: summarizedText,
                    };
                    return updatedMessages;
                });
                toast.success("Summarized text updated Successfully");
                return;
            }
            setMessages((prev) => {
                const newMessage = {
                    id: `custom-${Date.now()}`,
                    text: summarizedText,
                    sender: "AI",
                    summarizedId: message.id,
                };
                const updatedMessages = [...prev];
                const index = message.id;

                updatedMessages.splice(index, 0, newMessage);
                return updatedMessages;
            });
            toast.success("Summarized text Successfully");
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        } finally {
            setIsSummarizationInProgress("");
        }
    };

    const translateText = async (message) => {
        setErrorOn(message.id);

        const languageMap = {
            en: "English",
            fr: "French",
            pt: "Portuguese",
            es: "Spanish",
            tr: "Turkish",
            ru: "Russian",
        };

        if (!targetLanguage) {
            toast.warning("Choose a language to translate to.");
            return;
        }

        if (currentId !== message.id) {
            toast.warning("Select a language for the correct message.");
            return;
        }

        const alreadyTranslated = message.translations?.some(
            (translation) =>
                translation.language === languageMap[targetLanguage]
        );

        if (alreadyTranslated) {
            toast.info(
                `This message is already translated to ${languageMap[targetLanguage]}`
            );
            return;
        }

        try {
            setIsTranslationInProgress(true);
            const response = await textTranslation(message, targetLanguage);
            const translation = {
                language: languageMap[targetLanguage],
                result: response,
            };

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === message.id
                        ? {
                              ...msg,
                              translations: [
                                  ...(msg.translations || []),
                                  translation,
                              ],
                          }
                        : msg
                )
            );

            toast.success(
                `Translation to ${languageMap[targetLanguage]} successful!`
            );
            setErrorOn("");
        } catch (error) {
            toast.error(error.message);
            setErrorOn("");
            console.error("Translation error:", error);
        } finally {
            setIsTranslationInProgress(false);
        }
    };

    function autoExpand(textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy");
            console.error(err)
        }
    }

    return (
        <div className="absolute inset-0 flex flex-col max-h-[calc(100vh - 65px)] text-sm md:text-base">
            <div className="max-w-[780px] mx-auto w-full h-full flex flex-col px-4 lg:px-0 relative">
                <div
                    ref={chatRef}
                    className="flex-1 overflow-y-auto min-h-0 relative mb-24 custom-scrollbar"
                >
                    <div className="absolute inset-0 lg:px-5 pb-5">
                        <div className="py-4 space-y-4 relative h-full">
                            {messages?.length === 0 && (
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
                                                    ? `ml-auto flex flex-col max-w-[250px] sm:max-w-sm`
                                                    : ""
                                            }`}
                                        >
                                            <p
                                                tabIndex={0}
                                                aria-label={`This is the ${msg.sender}'s message`}
                                                className={`rounded-lg relative ${
                                                    msg.sender === "user"
                                                        ? ` ${
                                                              selectedTheme ===
                                                              "Neural Nexus"
                                                                  ? "shadow-lg shadow-teal-300/30 mb-1"
                                                                  : " "
                                                          } chat-bubble p-3`
                                                        : ""
                                                }`}
                                            >
                                                {isSummarizationInProgress ===
                                                    msg.id && (
                                                    <Spinner
                                                        spinnerClass="w-6 h-6"
                                                        className="pb-2"
                                                    />
                                                )}
                                                {msg.sender === "AI" ? (
                                                    <div
                                                        className="relative"
                                                        onMouseEnter={() => {
                                                            setShowCopyIcon(
                                                                msg.id
                                                            );
                                                        }}
                                                        onMouseLeave={() => {
                                                            setShowCopyIcon("");
                                                        }}
                                                    >
                                                        <div className="ai-icon mb-2">
                                                            <FaBahai
                                                                size={20}
                                                            />
                                                        </div>
                                                        <TypingMessage
                                                            text={msg.text}
                                                        />
                                                        {showCopyIcon ==
                                                            msg.id && (
                                                            <Button
                                                                type="button"
                                                                aria-label={`Click to copy ${msg.sender} generated text`}
                                                                className="absolute top-0 right-0"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    copyToClipboard(
                                                                        msg.text
                                                                    );
                                                                }}
                                                            >
                                                                <FaRegCopy
                                                                    size={20}
                                                                    className="cursor-pointer hover:scale-110"
                                                                />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    msg.text
                                                )}
                                            </p>
                                            {msg.sender === "user" && (
                                                <span
                                                    tabIndex={0}
                                                    aria-label={
                                                        msg.detectedLanguage ===
                                                        "beyond our language database"
                                                            ? "Detected language is unknown"
                                                            : `Detected language is ${msg.detectLanguage}`
                                                    }
                                                    className="text-xs italic"
                                                >
                                                    Detected Language:{" "}
                                                    {msg.detectedLanguage}
                                                </span>
                                            )}
                                        </motion.article>
                                        {msg.sender === "user" && (
                                            <div className="mt-5 w-full flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
                                                {msg.text.length > 150 && (
                                                    <Button
                                                        type="button"
                                                        aria-label="Click to summarize text."
                                                        onClick={() =>
                                                            summarizeText(msg)
                                                        }
                                                        className="action-button font-semibold"
                                                    >
                                                        Summarize
                                                    </Button>
                                                )}
                                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                                    <label
                                                        htmlFor={`language-select-${msg.id}`}
                                                        className="sr-only"
                                                    >
                                                        Select a target language
                                                        for translation
                                                    </label>
                                                    <select
                                                        className={`select-container  ${
                                                            errorOn === msg.id
                                                                ? "error"
                                                                : ""
                                                        }`}
                                                        name="language"
                                                        id={`language-select-${msg.id}`}
                                                        value={
                                                            currentId === msg.id
                                                                ? targetLanguage
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            setTargetLanguage(
                                                                e.target.value
                                                            );
                                                            setCurrentId(
                                                                msg.id
                                                            );
                                                            setErrorOn("");
                                                        }}
                                                        aria-labelledby={`language-select-${msg.id}`}
                                                        aria-invalid={
                                                            errorOn === msg.id
                                                                ? "true"
                                                                : "false"
                                                        }
                                                        aria-describedby={
                                                            errorOn === msg.id
                                                                ? `error-message-${msg.id}`
                                                                : undefined
                                                        }
                                                    >
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Select Language
                                                        </option>
                                                        {supportedLanguages
                                                            .filter(
                                                                (lang) =>
                                                                    lang.name !==
                                                                    msg.detectedLanguage
                                                            )
                                                            .map((language) => (
                                                                <option
                                                                    value={
                                                                        language.code
                                                                    }
                                                                    key={
                                                                        language.code
                                                                    }
                                                                >
                                                                    {
                                                                        language.name
                                                                    }
                                                                </option>
                                                            ))}
                                                    </select>
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            translateText(msg)
                                                        }
                                                        aria-label={
                                                            targetLanguage
                                                                ? `Translate text to ${targetLanguage}`
                                                                : "Translate text (select a language first)"
                                                        }
                                                        className={`action-button flex items-center gap-2 font-semibold ${
                                                            errorOn === msg.id
                                                                ? "error"
                                                                : ""
                                                        }`}
                                                    >
                                                        <IoLanguageSharp />
                                                        <span>Translate</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        {
                                            <div className="flex flex-col gap-4 mt-4">
                                                {isTranslationInProgress &&
                                                    currentId === msg.id && (
                                                        <Spinner
                                                            spinnerClass="w-6 h-6"
                                                            className="pb-2"
                                                        />
                                                    )}
                                                {msg.translations?.map(
                                                    (translation, index) => {
                                                        const isLastTranslation =
                                                            index ===
                                                            msg.translations
                                                                .length -
                                                                1;
                                                        return (
                                                            <div
                                                                onMouseEnter={() => {
                                                                    setShowCopyIcon(
                                                                        translation.language +
                                                                            String(
                                                                                msg.id
                                                                            )
                                                                    );
                                                                }}
                                                                onMouseLeave={() => {
                                                                    setShowCopyIcon(
                                                                        ""
                                                                    );
                                                                }}
                                                                ref={
                                                                    isLastTranslation
                                                                        ? lastTranslationRef
                                                                        : null
                                                                }
                                                                tabIndex={0}
                                                                key={index}
                                                                aria-label={`${translation.language} translation`}
                                                                className="relative translation-response p-2 rounded-xl flex flex-col gap-2 max-w-[256px] md:w-[400px] sm:max-w-sm mr-auto"
                                                            >
                                                                <p className="font-semibold">
                                                                    {
                                                                        translation.language
                                                                    }
                                                                </p>
                                                                <p>
                                                                    <TypingMessage
                                                                        text={
                                                                            translation.result
                                                                        }
                                                                        onComplete={
                                                                            isLastTranslation
                                                                                ? () => {
                                                                                      if (
                                                                                          lastTranslationRef.current
                                                                                      ) {
                                                                                          lastTranslationRef.current.scrollIntoView(
                                                                                              {
                                                                                                  behavior:
                                                                                                      "smooth",
                                                                                                  block: "nearest",
                                                                                              }
                                                                                          );
                                                                                      }
                                                                                  }
                                                                                : undefined
                                                                        }
                                                                    />
                                                                </p>
                                                                {showCopyIcon ==
                                                                    translation.language +
                                                                        String(
                                                                            msg.id
                                                                        ) && (
                                                                    <Button
                                                                        type="button"
                                                                        aria-label={`Click to copy ${translation.language} translated text`}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            copyToClipboard(
                                                                                translation.result
                                                                            );
                                                                        }}
                                                                        className="absolute top-0 -right-5 "
                                                                    >
                                                                        <FaRegCopy
                                                                            size={
                                                                                20
                                                                            }
                                                                            className="cursor-pointer hover:scale-110"
                                                                        />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div
                    className={`input-container absolute bottom-2 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-0 w-[95%] md:w-full max-h-[200px] ${
                        isThereError ? "error" : ""
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <textarea
                            ref={textRef}
                            aria-label="Input area"
                            className="flex-1 p-2 focus:outline-none resize-none overflow--y-auto max-h-[150px]"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setIsThereError(false);
                            }}
                            rows="1"
                            onInput={(e) => autoExpand(e.target)}
                            placeholder="Type a message..."
                        />
                        <Button
                            type="submit"
                            aria-label="Send button"
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
