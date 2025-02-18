import useTypingEffect from "../../hooks/useTypingEffect";

const TypingMessage = ({ text, ref }) => {
    const typedText = useTypingEffect(text, 50); // Adjust speed if needed
    return <>{typedText || <span className="opacity-50">...</span>}</>;
};

export default TypingMessage