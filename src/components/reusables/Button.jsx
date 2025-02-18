import PropTypes from "prop-types";

function Button({ children, className, onClick, href, ...props }) {

    return (
        <button
            {...props}
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            onClick={onClick}
            className={` text-center ${className}`}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    onClick: PropTypes.func,
    as: PropTypes.string,
    rel: PropTypes.string,
    target: PropTypes.string,
    href: PropTypes.string,
    ariaDisabled: PropTypes.string,
    ariaLabel: PropTypes.string,
};

export default Button;
