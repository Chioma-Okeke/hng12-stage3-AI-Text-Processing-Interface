import { useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowDown } from "react-icons/io";

function Select({ options, numberOfTickets, setNumberOfTickets, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        setFocusedIndex(-1);
    };

    return (
        <div className="relative w-full text-white">
            
            {/* Accessible Dropdown Button */}
            <button
                onClick={toggleDropdown}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { 
                        e.preventDefault();
                        toggleDropdown();  
                    }
                }}
                className="w-full flex justify-between items-center p-3 border border-[#07373F] bg-[#052228] rounded-lg hover:border-[#197686] focus:ring-2 focus:ring-[#197686]"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="dropdown-list"
                aria-label="Select number of tickets"
            >
                <span>{numberOfTickets ? numberOfTickets : placeholder}</span>
                <IoIosArrowDown
                    className={`w-5 h-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <ul
                    id="dropdown-list"
                    className="absolute left-0 mt-2 w-full border border-[#07373F] bg-[#052228] rounded-lg max-h-40 overflow-auto z-10"
                    role="listbox"
                    aria-label="Number of tickets"
                    tabIndex={-1}
                >
                    {options.map((option, index) => (
                        <li
                            key={option}
                            role="option"
                            aria-selected={numberOfTickets === option}
                            tabIndex={0}
                            onKeyDown={(e) =>
                            {
                                if (e.key === "Enter") {
                                    setNumberOfTickets(option)
                                    setIsOpen(false)
                                } 
                            }
                            }
                            onMouseEnter={() => setFocusedIndex(index)}
                            onClick={() => {
                                setNumberOfTickets(option);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2 flex justify-between items-center cursor-pointer transition-colors ${
                                focusedIndex === index
                                    ? "border border-[#197686] focus:ring-2 focus:ring-[#197686]"
                                    : "hover:border-blue-600"
                            }`}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

Select.propTypes = {
    options: PropTypes.array,
    numberOfTickets: PropTypes.number,
    setNumberOfTickets: PropTypes.func,
    placeholder: PropTypes.string,
};

export default Select;
