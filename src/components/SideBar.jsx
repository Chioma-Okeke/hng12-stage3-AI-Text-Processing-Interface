import PropTypes from "prop-types";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";
// import useThemeSwitcher from "../../../hooks/useThemeSwitcher";

function SideBar({
    setShowSideBar,
    handleSideBarToggle,
    setOpenSettings,
    setOpenHelp,
    selectedTheme,
}) {
    // const [openSettings, setOpenSettings] = useState(false);
    // const [isLocked, setIsLocked] = useState(false);
    // const [selectedTheme, setSelectedTheme] = useState("Light");
    // const [openHelp, setOpenHelp] = useState(false);
    // const [theme, setTheme] = useThemeSwitcher();

    return (
        <section
            className={`p-5 pr-10 h-full sidebar ${
                selectedTheme === "Neural Nexus"
                    ? "shadow-[8px_0px_16px_rgba(94,234,212,0.3)]"
                    : " "
            }`}
        >
            <div className="flex flex-col justify-between h-full">
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
        </section>
    );
}

SideBar.propTypes = {
    handleSideBarToggle: PropTypes.func,
    setShowSideBar: PropTypes.func,
};

export default SideBar;
