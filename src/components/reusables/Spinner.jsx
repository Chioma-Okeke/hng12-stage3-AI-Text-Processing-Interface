import PropTypes from "prop-types";

const Spinner = ({className, spinnerClass}) => {

    return (
        <div className={`w-full h-full ${className}`}>
            <div className={`border-4 spinner-color rounded-full animate-spin ${spinnerClass}`}></div>
        </div>
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
    spinnerClass: PropTypes.string
}

export default Spinner;
