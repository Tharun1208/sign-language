import { motion } from "framer-motion";

/**
 * Scroll-reveal wrapper. Use `delay` for manual staggering or wrap
 * children in <Stagger> for automatic sequencing.
 */
const Reveal = ({
  children,
  delay = 0,
  y = 20,
  once = true,
  className = "",
  style,
  as = "div",
}) => {
  const Component = motion[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

export const Stagger = ({ children, className = "", gap = 0.07, delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: gap, delayChildren: delay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", style }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      },
    }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

export default Reveal;
