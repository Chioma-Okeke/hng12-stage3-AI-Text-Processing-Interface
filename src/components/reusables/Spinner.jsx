import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const Spinner = ({className}) => {
    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) {
        console.error(
            "Modal root not found? Make sure to add <div id='modal-root'></div>"
        );
        return null;
    }

    return ReactDOM.createPortal(
        <div className={`flex items-center justify-center fixed inset-0 w-full h-full z-40 ${className}`}>
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[#24A0B5] rounded-full animate-spin"></div>
        </div>,
        modalRoot
    );
};

Spinner.propTypes = {
    className: PropTypes.string
}

export default Spinner;
