import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "./reusables/Button";
import PropTypes from "prop-types";

const TourModal = ({
    refElement,
    description,
    onNext,
    onSkip,
    containerRef,
}) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const modalRoot = document.getElementById("modal-root");

    useEffect(() => {
        const updatePosition = () => {
            if (refElement?.current) {
                const rect = refElement.current.getBoundingClientRect();
                setPosition({
                    top:
                        window.innerWidth < 1280 || refElement === containerRef
                            ? "50%"
                            : rect.top > 800
                            ? rect.top - 100
                            : rect.top + window.scrollY,
                    left:
                        refElement === containerRef || window.innerWidth < 1280
                            ? "50%"
                            : rect.left > 950
                            ? rect.left - 450
                            : rect.left === 12
                            ? 300
                            : rect.left === 223
                            ? rect.left + 50
                            : 0,
                });
            }
        };

        updatePosition();

        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, [refElement]);

    if (!modalRoot) {
        console.error(
            "Modal root not found? Make sure to add <div id='modal-root'></div>"
        );
        return null;
    }
    return ReactDOM.createPortal(
        <div
            tabIndex={0}
            aria-label="Tour guide dialog"
            className="bg-black/20 fixed inset-0 w-full h-full z-50"
        >
            <div
                className={`${
                    refElement === containerRef || window.innerWidth < 1280
                        ? "-translate-x-1/2 -translate-y-1/2"
                        : ""
                } bg-white p-4 flex flex-col gap-4 tour-container w-[90%] mx-auto lg:w-auto`}
                style={{
                    position: "absolute",
                    top: position.top,
                    left: position.left,
                }}
            >
                <div className="text-center">
                    {refElement === containerRef && (
                        <h1 className="logo">Welcome to Texifyit</h1>
                    )}
                    <p className="text-[#141414] text-lg sm:text-base">{description}</p>
                </div>
                <div className="flex items-center gap-4 justify-center text-lg sm:text-base">
                    <Button
                        type="button"
                        aria-label="Click to move to the next step"
                        className="action-button "
                        onClick={onNext}
                    >
                        Next
                    </Button>
                    <Button
                        type="button"
                        aria-label="Click to move to skip tour guide"
                        className="action-button "
                        onClick={onSkip}
                    >
                        Skip
                    </Button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

TourModal.propTypes = {
    refElement: PropTypes.element,
    description: PropTypes.string,
    onNext: PropTypes.func,
    onSkip: PropTypes.func,
    containerRef: PropTypes.element
};

export default TourModal;
