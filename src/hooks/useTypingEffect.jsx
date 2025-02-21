import { useEffect, useState } from "react";

const useTypingEffect = (text, speed = 50, onComplete) => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        if (!text) {
            if (onComplete) onComplete();
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev < text.length) {
                    setDisplayedText((prevText) => prevText + text[prev]);
                    return prev + 1;
                } else {
                    clearInterval(interval);

                    if (onComplete) onComplete();
                    return prev;
                }
            });
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    useEffect(() => {
        if (currentIndex === text.length) {
            setShowCursor(false);
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
