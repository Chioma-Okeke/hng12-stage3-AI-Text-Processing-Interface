import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";
import { getMessagesFromDB } from "../utils/storage";
// import useThemeSwitcher from "../../../hooks/useThemeSwitcher";

function SideBar({
    setShowSideBar,
    handleSideBarToggle,
    setOpenSettings,
    setOpenHelp,
    selectedTheme,
    populateChat
}) {
    // const [openSettings, setOpenSettings] = useState(false);
    // const [isLocked, setIsLocked] = useState(false);
    // const [selectedTheme, setSelectedTheme] = useState("Light");
    // const [openHelp, setOpenHelp] = useState(false);
    // const [theme, setTheme] = useThemeSwitcher();
    const [fetchedData, setFetchedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMessagesFromDB();
                setFetchedData(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <section
            className={`p-5 pr-10 h-full sidebar ${
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
                    {/* <span className="text-soft-dark dark:text-primary-light">
                        Texifyit
                    </span> */}
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-2">
                        {fetchedData.map((Message, index) => {
                            return (
                                <div
                                    className="cursor-pointer hover:bg-gray-400 transition-colors ease-in-out duration-300 px-1 py-2 rounded-xl"
                                    key={index}
                                    onClick={() => populateChat(Message.messages)}
                                >
                                    <p>{Message.messages[0].text.slice(0, 25)}</p>
                                </div>
                            );
                        })}
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
};

export default SideBar;
