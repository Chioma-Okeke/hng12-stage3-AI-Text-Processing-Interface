import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { is7DaysAgo, isToday, isYesterday } from "../utils/dateUtils";

function SideBar({
    setShowSideBar,
    handleSideBarToggle,
    setOpenSettings,
    setOpenHelp,
    selectedTheme,
    populateChat,
    fetchedData,
    deleteChat,
    historyRef,
    settingsRef,
    helpRef,
    activeRef
}) {
    const [todayData, setTodayData] = useState([]);
    const [yesterdayData, setYesterdayData] = useState([]);
    const [prev7DaysData, setPrev7DaysData] = useState([]);

    useEffect(() => {
        if (!fetchedData) return;

        let today = [];
        let yesterday = [];
        let prev7Days = [];

        fetchedData?.forEach((data) => {
            if (isToday(data.timeStamp)) {
                today.push(data);
            } else if (isYesterday(data.timeStamp)) {
                yesterday.push(data);
            } else if (is7DaysAgo(data.timeStamp)) {
                prev7Days.push(data);
            } else {
                console.log("Older:", data);
            }
        });

        today.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        yesterday.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        prev7Days.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

        setTodayData(today);
        setYesterdayData(yesterday);
        setPrev7DaysData(prev7Days);
    }, [fetchedData]);

    return (
        <section
            className={`pb-5 pt-7 sm:pt-11 px-3 h-full sidebar ${
                selectedTheme === "Neural Nexus"
                    ? "shadow-[8px_0px_16px_rgba(94,234,212,0.3)]"
                    : " "
            }`}
        >
            <div className="flex flex-col gap-8 h-full">
                <div className="flex justify-between items-center">
                    <div
                        className="cursor-pointer hover:scale-110 w-fit"
                        onClick={() => setShowSideBar(false)}
                        aria-label="menu icon"
                        tabIndex={0}
                        onKeyDown={(e) =>
                            e.key === "Enter" && setShowSideBar(false)
                        }
                    >
                        <HiOutlineMenuAlt1 size={25} />
                    </div>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div ref={historyRef}
                            className={`flex flex-col gap-5 overflow-y-auto custom-scrollbar ${
                                activeRef === historyRef ? "active" : ""
                            }`}>
                        {todayData.length > 0 && (
                            <div>
                                <p className="font-semibold px-2 lg:pb-1">Today</p>
                                <ol className="flex flex-col">
                                    {todayData?.map((message, index) => {
                                        return (
                                            <li
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        populateChat(message);
                                                    }
                                                }}
                                                className="cursor-pointer hover:border hover:border-gray-200 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(message)
                                                }
                                            >
                                                <p>
                                                    {message.messages[0].text.slice(
                                                        0,
                                                        window.innerWidth > 640
                                                            ? 24
                                                            : 20
                                                    )}
                                                </p>
                                                <RiDeleteBinLine
                                                    className="hover:scale-110"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteChat(message.id)
                                                    }
                                                    }
                                                />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                        {yesterdayData.length > 0 && (
                            <div>
                                <p className="font-semibold px-2 lg:pb-1">Yesterday</p>
                                <ol className="flex flex-col">
                                    {yesterdayData?.map((message, index) => {
                                        return (
                                            <li
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        populateChat(message);
                                                    }
                                                }}
                                                className="cursor-pointer hover:border hover:border-gray-200 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(
                                                        message.messages
                                                    )
                                                }
                                            >
                                                <p>
                                                    {message.messages[0].text.slice(
                                                        0,
                                                        window.innerWidth > 640
                                                            ? 24
                                                            : 20
                                                    )}
                                                </p>
                                                <RiDeleteBinLine className="hover:scale-110" onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteChat(message.id)
                                                }} />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )} 
                        {prev7DaysData.length > 0 && (
                            <div>
                                <p className="font-semibold px-2 lg:pb-1">Last 7 Days</p>
                                <ol className="flex flex-col">
                                    {prev7DaysData?.map((message, index) => {
                                        return (
                                            <li
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        populateChat(message);
                                                    }
                                                }}
                                                className="cursor-pointer hover:border hover:border-gray-200 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(
                                                        message.messages
                                                    )
                                                }
                                            >
                                                <p>
                                                    {message.messages[0].text.slice(
                                                        0,
                                                        window.innerWidth > 640
                                                            ? 24
                                                            : 20
                                                    )}
                                                </p>
                                                <RiDeleteBinLine className="hover:scale-110" onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteChat(message.id)
                                                }}/>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div
                            ref={settingsRef}
                            aria-label="settings icon"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setOpenSettings(true);
                                    handleSideBarToggle();
                                }
                            }}
                            onClick={() => {
                                setOpenSettings(true);
                                handleSideBarToggle();
                            }}
                            className={`${
                                activeRef === settingsRef ? "active" : ""
                            }`}
                        >
                            <IoSettingsOutline
                                size={25}
                                className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                            />
                        </div>
                        <div
                            ref={helpRef}
                            aria-label="help icon"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setOpenHelp(true);
                                    handleSideBarToggle();
                                }
                            }}
                            onClick={() => {
                                setOpenHelp(true);
                                handleSideBarToggle();
                            }}
                            className={`${
                                activeRef === helpRef ? "active" : ""
                            }`}
                        >
                            <LuCircleHelp
                                size={25}
                                className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

SideBar.propTypes = {
    handleSideBarToggle: PropTypes.func,
    setShowSideBar: PropTypes.func,
    setOpenHelp: PropTypes.func,
    setOpenSettings: PropTypes.func,
    populateChat: PropTypes.func,
    fetchedData: PropTypes.array,
    selectedTheme: PropTypes.string,
    deleteChat: PropTypes.func,
    historyRef: PropTypes.element,
    settingsRef: PropTypes.element,
    helpRef: PropTypes.element,
    activeRef: PropTypes.element
};

export default SideBar;
