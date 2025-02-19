import React from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import editIcon from "../assets/edit.svg";
import PropTypes from "prop-types";

function AppHeader({ showSideBar, setShowSideBar, startNewChat }) {
    return (
        <header className="p-5 w-full header mb-2">
            <div className="flex items-center justify-between">
                {!showSideBar && (
                    <HiOutlineMenuAlt1
                        size={25}
                        onClick={() => setShowSideBar(true)}
                        className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-300"
                    />
                )}
                <h1
                    className={`logo ${
                        showSideBar ? "flex-1 text-center" : ""
                    }`}
                >
                    Texifyit
                </h1>
                <img
                    onClick={startNewChat}
                    src={editIcon}
                    alt="Edit Icon"
                    className="cursor-pointer"
                />
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
