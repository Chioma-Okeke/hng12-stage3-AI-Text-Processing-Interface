import React from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import editIcon from "../assets/edit.svg";

function AppHeader({ showSideBar, setShowSideBar }) {
    return (
        <header className="p-5 w-full bg-white mb-2">
            <div className="flex items-center justify-between">
                {!showSideBar && (
                    <HiOutlineMenuAlt1 
                        size={25} 
                        onClick={() => setShowSideBar(true)}
                        className="cursor-pointer" 
                    />
                )}
                <h1 className={`${showSideBar ? "flex-1 text-center" : ""}`}>Texify</h1>
                <img src={editIcon} alt="Edit Icon" className="cursor-pointer" />
            </div>
        </header>
    );
}

export default AppHeader;
