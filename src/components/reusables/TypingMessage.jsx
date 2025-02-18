import useTypingEffect from "../../hooks/useTypingEffect";
import PropTypes from "prop-types";

const TypingMessage = ({ text }) => {
    const typedText = useTypingEffect(text, 50); // Adjust speed if needed
    return <>{typedText || <span className="opacity-50">...</span>}</>;
};

TypingMessage.propTypes = {
    text: PropTypes.string.isRequired,
}

export default TypingMessage