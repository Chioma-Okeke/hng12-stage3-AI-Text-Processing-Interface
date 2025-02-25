import { AnimatePresence, motion } from "framer-motion";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatInterface from "../components/ChatInterface";
import SideBar from "../components/SideBar";
import AppHeader from "../components/AppHeader";
import { IoCloseSharp } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import Modal from "../components/reusables/Modal";
import Select from "../components/reusables/Select";
import Button from "../components/reusables/Button";
import { applyTheme } from "../utils/theme";
import { makeCamelCase, removeCamelCase } from "../utils/textConveters";
import { toast } from "sonner";
import {
    clearLocalStorage,
    clearMessagesDB,
    deleteMessage,
    getMessagesFromDB,
    saveMessagesToDB,
    updateMessagesDB,
} from "../utils/storage";
import { FAQ } from "../data/faq";
import TourModal from "../components/TourModal";

function Home() {
    const [showSideBar, setShowSideBar] = useState(
        window.innerWidth > 1280 ? true : false
    );
    const [openSettings, setOpenSettings] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("");
    const [openHelp, setOpenHelp] = useState(false);
    const [messages, setMessages] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeRef, setActiveRef] = useState(null);
    const [isTourActive, setIsTourActive] = useState(
        !localStorage.getItem("oldUser") ||
            JSON.parse(localStorage.getItem("pendingOnboarding"))
    );
    const newChatRef = useRef(null);
    const historyRef = useRef(null);
    const settingsRef = useRef(null);
    const helpRef = useRef(null);
    const chatRef = useRef(null);

    const steps = [
        {
            ref: chatRef,
            description:
                "An AI powered application where you can translate, detect the language of and summarize your long texts",
        },
        {
            ref: newChatRef,
            description:
                "This is the new chat icon you can use to start a new chat.",
        },
        { ref: historyRef, description: "You will see all chat history here" },
        {
            ref: settingsRef,
            description: "You come here for UI customization and other things",
        },
        {
            ref: helpRef,
            description: "You can find out more about the product here",
        },
    ];
    useEffect(() => {
        setActiveRef(steps[currentStep].ref);
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
            window.innerWidth < 1280 && currentStep !== 0 && setShowSideBar(true)
        } else {
            window.innerWidth < 1280 && setShowSideBar(false)
            setActiveRef(null);
            setIsTourActive(false);
            localStorage.setItem("oldUser", true);
            localStorage.setItem("pendingOnboarding", false);
        }
    };

    const handleSkip = () => {
        setActiveRef(null);
        setIsTourActive(false);
        window.innerWidth < 1280 && setShowSideBar(false)
        localStorage.setItem("pendingOnboarding", true);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("selectedTheme") || "light";
        applyTheme(savedTheme);
        setSelectedTheme(removeCamelCase(savedTheme));
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const data = await getMessagesFromDB();
            setFetchedData(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const chosenTheme = useCallback((option) => {
        const camelCasedOption = makeCamelCase(option);
        applyTheme(camelCasedOption);
        setSelectedTheme(option);
    }, []);

    function closeSideBar() {
        if (window.innerWidth < 1280 && showSideBar) {
            setShowSideBar((prevState) => !prevState);
        }
    }

    const handleSideBarToggle = () => {
        setShowSideBar((prevState) => !prevState);
    };

    const deleteChats = async () => {
        try {
            await clearMessagesDB();
            toast.success("Chats deleted successfully");
            await fetchData();
        } catch (error) {
            console.error(error);
        }
        clearLocalStorage();
        setMessages([]);
        setOpenSettings(false);
    };

    const deleteChat = useCallback(async (chatId) => {
        try {
            await deleteMessage(chatId);
            toast.success("Chat successfully deleted.");
            await fetchData();
        } catch (error) {
            toast.error(error.message);
        }
        clearLocalStorage();
        setMessages([]);
    }, []);

    const openNewChat = useCallback(async () => {
        if (messages.length === 0) {
            toast.info("This is a new chat.");
            return;
        }
        try {
            const currentChat = localStorage.getItem("currentChat");
            if (!currentChat) {
                await saveMessagesToDB({
                    messages: messages,
                    timeStamp: new Date().toISOString(),
                });
                toast.success("Chat successfully saved");
            } else {
                const chat = JSON.parse(currentChat);
                const updatedMessages = {
                    messages: messages,
                    timeStamp: new Date(),
                };
                await updateMessagesDB(chat.id, updatedMessages);
                toast.success("Chat successfully updated");
            }
            localStorage.removeItem("currentChat");
            await fetchData();
        } catch (error) {
            console.error("Error saving messages:", error);
            toast.error("An Error occurred when saving messages");
        }
        setMessages([]);
    }, [messages, fetchData]);

    const populateChat = useCallback(
        async (chat) => {
            localStorage.setItem("currentChat", JSON.stringify(chat));
            setMessages(chat.messages);
            if (window.innerWidth < 1280) {
                setShowSideBar(false);
            }
        },
        [setMessages]
    );

    const sidebarWidth = window.innerWidth > 1280 ? "261px" : "";
    return (
        <main ref={chatRef} className="relative h-screen w-full ">
            <AnimatePresence>
                {showSideBar && (
                    <motion.div
                        key="sidebar"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.4 }}
                        className="fixed left-0 top-0 h-screen w-[70%] max-w-[261px] z-50"
                    >
                        <SideBar
                            setShowSideBar={setShowSideBar}
                            handleSideBarToggle={handleSideBarToggle}
                            setOpenHelp={setOpenHelp}
                            setOpenSettings={setOpenSettings}
                            selectedTheme={selectedTheme}
                            populateChat={populateChat}
                            fetchedData={fetchedData}
                            deleteChat={deleteChat}
                            historyRef={historyRef}
                            settingsRef={settingsRef}
                            helpRef={helpRef}
                            activeRef={activeRef}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.main
                initial={{ paddingLeft: 0 }}
                animate={{
                    paddingLeft: showSideBar ? sidebarWidth : 0,
                }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full w-full max-h-screen"
            >
                <AppHeader
                    showSideBar={showSideBar}
                    setShowSideBar={setShowSideBar}
                    startNewChat={openNewChat}
                    newChatRef={newChatRef}
                    activeRef={activeRef}
                />
                <div
                    aria-label="chat output area"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            closeSideBar();
                        }
                    }}
                    onClick={closeSideBar}
                    className="flex-1 overflow-hidden relative "
                >
                    <ChatInterface
                        selectedTheme={selectedTheme}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </div>
            </motion.main>
            {openSettings && (
                <Modal
                    closeModal={() => {
                        setOpenSettings(false);
                    }}
                >
                    <div className="modal-container px-5 py-5 md:px-10 rounded-2xl w-[90%] md:w-[70%] max-w-[680px] mx-auto flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b pb-3 border-black">
                            <h1 className="font-bold text-2xl">Settings</h1>
                            <div
                                aria-label="Settings close icon"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setOpenSettings(false);
                                    }
                                }}
                                onClick={() => {
                                    setOpenSettings(false);
                                }}
                            >
                                <IoCloseSharp
                                    size={25}
                                    className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <p className="flex-1">Theme</p>
                            <Select
                                options={[
                                    "Light",
                                    "Dark",
                                    "Cyberpunk",
                                    "Soft Pastel",
                                    "Sunset Glow",
                                    "Neural Nexus",
                                ]}
                                dropDownClass="drop-container"
                                className="w-[60%] sm:w-[40%]"
                                setSelectedOption={chosenTheme}
                                selectedOption={selectedTheme}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Delete all Chats</p>
                            <Button
                                type="button"
                                aria-label="Click to delete chat history"
                                onClick={deleteChats}
                                className="px-6 py-2 rounded-3xl bg-red-600 text-white hover:scale-105 transition-all ease-in-out duration-300"
                            >
                                Delete all
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {openHelp && (
                <Modal
                    closeModal={() => {
                        setOpenHelp(false);
                    }}
                >
                    <div className="modal-container py-5 px-5 md:px-10 rounded-[40px] w-[90%] md:w-[70%] max-w-[680px] h-[70%] md:h-auto mx-auto flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b pb-3 border-black">
                            <h1 className="font-bold text-2xl">Help</h1>
                            <div
                                aria-label="Help section close icon"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setOpenHelp(false);
                                    }
                                }}
                                onClick={() => {
                                    setOpenHelp(false);
                                }}
                            >
                                <IoCloseSharp
                                    size={25}
                                    className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                                />
                            </div>
                        </div>
                        <ul className="overflow-y-auto ">
                            {FAQ.map((faq, index) => {
                                return (
                                    <li key={index} className="flex gap-4 py-2">
                                        <FiCheckCircle
                                            size={20}
                                            className=" flex-shrink-0 mt-1"
                                        />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {faq.question}
                                            </h3>
                                            <p>{faq.answer}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </Modal>
            )}
            {isTourActive &&  (
                <TourModal
                    refElement={steps[currentStep]?.ref}
                    description={steps[currentStep]?.description}
                    onNext={handleNext}
                    onSkip={handleSkip}
                    containerRef={chatRef}
                />
            )}
        </main>
    );
}

export default Home;
