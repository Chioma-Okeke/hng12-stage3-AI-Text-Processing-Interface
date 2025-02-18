import { useEffect, useState } from "react";

const useTypingEffect = (text, speed = 50) => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText(""); // Reset text when input changes
        setCurrentIndex(0); // Reset index
        if (!text) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev < text.length) {
                    setDisplayedText((prevText) => prevText + text[prev]);
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    return prev;
                }
            });
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    // Blinking cursor effect
    useEffect(() => {
        if (currentIndex === text.length) {
            setShowCursor(false); // Stop cursor when typing is done
            return;
        }

        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, [currentIndex, text.length]);

    return displayedText + (showCursor ? " |" : "");
};

export default useTypingEffect;
