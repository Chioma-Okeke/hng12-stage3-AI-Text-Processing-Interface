import React from "react";
import { FaAngleDown } from "react-icons/fa";

function BackToBottom() {
    const [showScrollBottomButton, setShowScrollBottomButton] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY < document.body.offsetHeight - 300) {
                setShowScrollBottomButton(true);
            } else {
                setShowScrollBottomButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    function scrollBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }

    return (
        <div>
            {showScrollBottomButton && (
                <FaAngleDown
                    size={50}
                    onClick={scrollBottom}
                    color="white"
                    className="fixed bottom-4 right-5 bg-[#0020f1] p-2 cursor-pointer rounded-full shadow-lg transition ease-out hover:scale-110 duration-300 z-50"
                />
            )}
        </div>
    );
}

export default BackToBottom;
