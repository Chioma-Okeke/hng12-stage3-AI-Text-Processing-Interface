import PropTypes from "prop-types";

function Button({ children, className, onClick, href, ...props }) {
    const Component = href ? "a" : "button"; 

    return (
        <Component
            {...props}
            href={href}
            target={href ? "_blank" : undefined}
            rel={href ? "noopener noreferrer" : undefined}
            onClick={onClick}
            className={`px-6 py-3 text-center ${className}`}
        >
            {children}
        </Component>
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
