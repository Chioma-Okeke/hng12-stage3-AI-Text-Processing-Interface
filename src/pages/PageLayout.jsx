import { AnimatePresence, motion } from "framer-motion";

import { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import SideBar from "../components/SideBar";
import AppHeader from "../components/AppHeader";

function PageLayout() {
    const [showSideBar, setShowSideBar] = useState(false);

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
                        className="fixed left-0 top-0 h-full w-[70%] lg:w-[261px] z-50"
                    >
                        <SideBar
                            setShowSideBar={setShowSideBar}
                            handleSideBarToggle={handleSideBarToggle}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.section
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
                    <ChatInterface />
                </div>
            </motion.section>
        </main>
    );
}

export default PageLayout;
