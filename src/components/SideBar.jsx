import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";
import { getMessagesFromDB } from "../utils/storage";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { is7DaysAgo, isToday, isYesterday } from "../utils/dateUtils";
// import useThemeSwitcher from "../../../hooks/useThemeSwitcher";

function SideBar({
    setShowSideBar,
    handleSideBarToggle,
    setOpenSettings,
    setOpenHelp,
    selectedTheme,
    populateChat,
    fetchedData,
}) {
    // const [openSettings, setOpenSettings] = useState(false);
    // const [isLocked, setIsLocked] = useState(false);
    // const [selectedTheme, setSelectedTheme] = useState("Light");
    // const [openHelp, setOpenHelp] = useState(false);
    // const [theme, setTheme] = useThemeSwitcher();
    const [todayData, setTodayData] = useState([]);
    const [yesterdayData, setYesterdayData] = useState([]);
    const [prev7DaysData, setPrev7DaysData] = useState([]);
    const [prev30DaysData, setPrev30DaysData] = useState([]);

    useEffect(() => {
        if (!fetchedData ) return;

        // clearing state before setting
        let today = []
        let yesterday = []
        let prev7Days = []

        //setting of state
        fetchedData?.forEach((data) => {
            if (isToday(data.timeStamp)) {
                today.push(data)
            } else if (isYesterday(data.timeStamp)) {
                yesterday.push(data)
            } else if (is7DaysAgo(data.timeStamp)) {
                prev7Days.push(data)
            } else {
                console.log("Older:", data);
            }
        });

        today.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
        yesterday.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
        prev7Days.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))

        setTodayData(today)
        setYesterdayData(yesterday)
        setPrev7DaysData(prev7Days)
    }, [fetchedData]);

    return (
        <section
            className={`py-5 px-3 h-full sidebar ${
                selectedTheme === "Neural Nexus"
                    ? "shadow-[8px_0px_16px_rgba(94,234,212,0.3)]"
                    : " "
            }`}
        >
            <div className="flex flex-col gap-8 h-full">
                <div className="flex justify-between items-center">
                    <div
                        className="cursor-pointer hover:scale-105 w-fit"
                        onClick={() => setShowSideBar(false)}
                    >
                        <HiOutlineMenuAlt1 size={25} />
                    </div>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-5">
                        {todayData.length > 0 && (
                            <div>
                                <p className="font-semibold">Today</p>
                                <ol className="flex flex-col">
                                    {todayData?.map((Message, index) => {
                                        return (
                                            <li
                                                className="cursor-pointer hover:bg-gray-400 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(
                                                        Message
                                                    )
                                                }
                                            >
                                                <p>
                                                    {Message.messages[0].text.slice(
                                                        0,
                                                        24
                                                    )}
                                                </p>
                                                <HiOutlineDotsHorizontal />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                        {yesterdayData.length > 0 && (
                            <div>
                                <p className="font-semibold">Yesterday</p>
                                <ol className="flex flex-col">
                                    {yesterdayData?.map((Message, index) => {
                                        return (
                                            <li
                                                className="cursor-pointer hover:bg-gray-400 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(
                                                        Message.messages
                                                    )
                                                }
                                            >
                                                <p>
                                                    {Message.messages[0].text.slice(
                                                        0,
                                                        24
                                                    )}
                                                </p>
                                                <HiOutlineDotsHorizontal />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                        {prev7DaysData.length > 0 && (
                            <div>
                                <p className="font-semibold">Last 7 Days</p>
                                <ol className="flex flex-col">
                                    {prev7DaysData?.map((Message, index) => {
                                        return (
                                            <li
                                                className="cursor-pointer hover:bg-gray-400 transition-colors ease-in-out duration-300 p-2 rounded-xl flex flex-row items-center justify-between"
                                                key={index}
                                                onClick={() =>
                                                    populateChat(
                                                        Message.messages
                                                    )
                                                }
                                            >
                                                <p>
                                                    {Message.messages[0].text.slice(
                                                        0,
                                                        24
                                                    )}
                                                </p>
                                                <HiOutlineDotsHorizontal />
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <IoSettingsOutline
                            onClick={() => {
                                setOpenSettings(true);
                                handleSideBarToggle();
                            }}
                            size={25}
                            className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                        />
                        <LuCircleHelp
                            onClick={() => {
                                setOpenHelp(true);
                                handleSideBarToggle();
                            }}
                            size={25}
                            className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-300"
                        />
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
};

export default SideBar;
