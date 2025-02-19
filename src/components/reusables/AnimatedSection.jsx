
import PropTypes from "prop-types"
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function AnimatedSection({ children, ...props }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.08,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export default AnimatedSection

AnimatedSection.propTypes = {
    children: PropTypes.element
}