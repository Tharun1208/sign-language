import { motion } from "framer-motion";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Tharun H S",
      education: "B.E. Computer Science Engineering",
    },
    {
      name: "Hemanth K J",
      education: "B.E. Computer Science Engineering",
    },
    {
      name: "AjayKumar M R",
      education: "B.E. Computer Science Engineering",
    },
    {
      name: "Vinay V",
      education: "B.E. Computer Science Engineering",
    },
  ];

  return (
    <section className="card">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="row row-between" style={{ alignItems: "flex-start" }}>
        <div>
          <span className="badge badge-pri">Team</span>

          <h2 className="mt-2">Development Team</h2>

          <p className="text-sm text-muted">
            The team behind SignAI
          </p>
        </div>

        <span className="badge badge-info">
          {teamMembers.length} Members
        </span>
      </div>

      {/* =========================================
          TEAM MEMBERS
      ========================================= */}

      <div className="stack gap-2 mt-6">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="card card-flat"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  minWidth: 0,
                }}
              >
                <span className="avatar" style={{ flex: "none" }}>
                  {getInitials(member.name)}
                </span>

                <div style={{ minWidth: 0 }}>
                  <h3 className="m-0 text-sm fw-semibold">
                    {member.name}
                  </h3>

                  <p className="m-0 text-xs text-muted mt-1">
                    {member.education}
                  </p>
                </div>
              </div>

              <span className="badge" style={{ flex: "none" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div
        className="mt-6 pt-4"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <p className="text-xs text-muted">
          A collaborative team building an AI-powered
          Sign Language Recognition system.
        </p>
      </div>

    </section>
  );
};

export default TeamSection;
