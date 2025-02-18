import { AnimatePresence, motion } from "framer-motion";

import { useCallback, useEffect, useState } from "react";
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

const FAQ = [
    {
        question: "What is Texifyit?",
        answer: "Texifyit is a text processing interface that uses AI to help you with your text processing needs.",
    },
    {
        question: "How do I use Texifyit?",
        answer: "Simply type or paste the text you want to process in the text area and select the processing options you want.",
    },
    {
        question: "What processing options are available?",
        answer: "Texifyit currently supports text summarization, sentiment analysis, and text translation.",
    },
    {
        question: "How do I change the theme?",
        answer: "You can change the theme by clicking on the settings icon in the sidebar and selecting the theme you want.",
    },
    {
        question: "Can I delete all chats?",
        answer: "Yes, you can delete all chats by clicking on the settings icon in the sidebar and selecting the delete all chats option.",
    },
    {
        question: "What languages are supported for translation?",
        answer: "Texifyit currently supports translation to and from English, Portuguese, French, Spanish, Russian, and Turkish",
    },
];

function PageLayout() {
    const [showSideBar, setShowSideBar] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState("");
    const [openHelp, setOpenHelp] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("selectedTheme") || "light"
        applyTheme(savedTheme)
        setSelectedTheme(removeCamelCase(savedTheme))
    }, [])

    const chosenTheme = useCallback((option) => {
        const camelCasedOption = makeCamelCase(option)
        applyTheme(camelCasedOption)
        setSelectedTheme(option)
    }, [])

    function closeSideBar() {
        if (window.innerWidth < 1024 && showSideBar) {
            setShowSideBar((prevState) => !prevState);
        }
    }

    const handleSideBarToggle = () => {
        setShowSideBar((prevState) => !prevState);
    };

    const sidebarWidth = window.innerWidth > 1280 ? "261px" : "";
    return (
        <main className="relative h-screen w-full ">
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
                />
                <div
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            closeSideBar();
                        }
                    }}
                    onClick={closeSideBar}
                    className="flex-1 overflow-hidden relative "
                >
                    <ChatInterface selectedTheme={selectedTheme}/>
                </div>
            </motion.main>
            {openSettings && (
                <Modal
                    closeModal={() => {
                        setOpenSettings(false);
                        setIsLocked(false);
                    }}
                >
                    <div className="modal-container px-5 py-5 md:px-10 rounded-2xl w-[90%] md:w-[70%] max-w-[680px] mx-auto flex flex-col gap-8">
                        <div className="flex items-center justify-between border-b pb-3 border-black">
                            <h1 className="font-bold text-2xl">Settings</h1>
                            <IoCloseSharp
                                size={25}
                                onClick={() => {
                                    setOpenSettings(false);
                                    setIsLocked(false);
                                }}
                                className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                            />
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
                                    "Neural Nexus"
                                ]}
                                dropDownClass="drop-container"
                                className="w-[40%]"
                                setSelectedOption={chosenTheme}
                                selectedOption={selectedTheme}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <p>Delete all Chats</p>
                            <Button className="px-6 py-2 rounded-3xl bg-red-600 text-white hover:scale-105 transition-all ease-in-out duration-300">
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
                        setIsLocked(false);
                    }}
                >
                    <div className="modal-container py-5 px-5 md:px-10 rounded-[40px] w-[90%] md:w-[70%] max-w-[680px] h-[70%] md:h-auto mx-auto flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b pb-3 border-black">
                            <h1 className="font-bold text-2xl">Help</h1>
                            <IoCloseSharp
                                size={25}
                                onClick={() => {
                                    setOpenHelp(false);
                                    setIsLocked(false);
                                }}
                                className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                            />
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
        </main>
    );
}

export default PageLayout;
