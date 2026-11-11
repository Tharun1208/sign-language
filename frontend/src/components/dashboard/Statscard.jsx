import { motion } from "framer-motion";
import AnimatedNumber from "../ui/AnimatedNumber";

const StatsCard = ({
  title,
  value,
  numericValue,
  decimals = 0,
  suffix = "",
  prefix = "",
  color = "#5B3FD9",
  description = "Performance metric",
  delay = 0,
  trend,
}) => {
  const canAnimate = typeof numericValue === "number" && Number.isFinite(numericValue);

  return (
    <motion.div
      className="card stat-card card-hover spotlight"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--accent": color }}
    >
      <div className="row row-between" style={{ gap: "var(--space-2)" }}>
        <span className="stat-label">{title}</span>
        {trend ? (
          <span className="badge badge-ok">{trend}</span>
        ) : (
          <span
            aria-hidden="true"
            style={{ width: 8, height: 8, borderRadius: "50%", background: color, flex: "none", boxShadow: `0 0 0 4px color-mix(in srgb, ${color} 18%, transparent)` }}
          />
        )}
      </div>

      <div className="stat-value">
        {canAnimate ? (
          <AnimatedNumber value={numericValue} decimals={decimals} prefix={prefix} suffix={suffix} />
        ) : (
          value
        )}
      </div>

      <div className="stat-meta">{description}</div>
    </motion.div>
  );
};

export default StatsCard;
