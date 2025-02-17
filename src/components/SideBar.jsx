import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
// import useThemeSwitcher from "../../../hooks/useThemeSwitcher";

function SideBar({ setShowSideBar, handleSideBarToggle }) {
    // const [theme, setTheme] = useThemeSwitcher();

    return (
        <section className=" py-10 pl-6 pr-6 h-screen bg-gray-400">
            <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-center">
                    <div
                        className="mb-12 cursor-pointer hover:scale-105 w-fit"
                        onClick={() => setShowSideBar(false)}
                    >
                        <HiOutlineMenuAlt1 size={25}/>
                    </div>
                    <Link
                        to={"/user/dashboard"}
                        onClick={() => {
                            if (window.innerWidth < 1024) handleSideBarToggle();
                        }}
                        className={({ isActive }) => {
                            return (
                                "flex items-center gap-3 mb-4 p-2 dark:hover:bg-primary-dark rounded-lg " +
                                (isActive
                                    ? "bg-primary-light dark:bg-primary-dark"
                                    : "")
                            );
                        }}
                    >
                        {/* {theme === "dark" ? (
                                    <img src={LogoDark} alt="Dark Logo" />
                                ) : (
                                    <img
                                        src={LogoLight}
                                        alt="Light Logo"
                                        className="w-[21.45px]"
                                    />
                                )} */}
                        <span className="text-soft-dark dark:text-primary-light">
                            InterviewAI
                        </span>
                    </Link>
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
