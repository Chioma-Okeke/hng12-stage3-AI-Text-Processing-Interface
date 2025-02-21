import useTypingEffect from "../../hooks/useTypingEffect";
import PropTypes from "prop-types";

const TypingMessage = ({ text, onComplete  }) => {
    const typedText = useTypingEffect(text, 50, onComplete);
    return <>{typedText || <span className="opacity-50">...</span>}</>;
};

TypingMessage.propTypes = {
    text: PropTypes.string.isRequired,
    onComplete: PropTypes.func
}

export default TypingMessage