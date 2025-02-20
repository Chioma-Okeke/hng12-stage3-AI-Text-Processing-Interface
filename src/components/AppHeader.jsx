import { HiOutlineMenuAlt1 } from "react-icons/hi";
import PropTypes from "prop-types";
import { LiaEditSolid } from "react-icons/lia";

function AppHeader({ showSideBar, setShowSideBar, startNewChat }) {
    return (
        <header className="p-5 w-full header mb-2">
            <div className="flex items-center justify-between">
                {!showSideBar && (
                    <div
                        aria-label="menu icon"
                        tabIndex={0}
                        onKeyDown={(e) =>
                            e.key === "Enter" && setShowSideBar(true)
                        }
                        onClick={() => setShowSideBar(true)}
                    >
                        <HiOutlineMenuAlt1
                            size={25}
                            className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-300"
                        />
                    </div>
                )}
                <h1
                    aria-label="Logo"
                    className={`logo ${
                        showSideBar ? "flex-1 text-center" : ""
                    }`}
                >
                    Texifyit
                </h1>
                <div
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && startNewChat()}
                    onClick={startNewChat}
                    aria-label="Edit Icon"
                    className="cursor-pointer"
                >
                    <LiaEditSolid size={25} className="hover:scale-110" />
                </div>
            </div>
        </header>
    );
}

AppHeader.propTypes = {
    showSideBar: PropTypes.bool,
    setShowSideBar: PropTypes.func,
    startNewChat: PropTypes.func,
};

export default AppHeader;
