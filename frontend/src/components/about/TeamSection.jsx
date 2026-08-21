import { Users, GraduationCap } from "lucide-react";

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
    <section
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        sm:rounded-2xl
        border
        p-4
        sm:p-5
        md:p-6
        lg:p-8

        shadow-sm
        transition-all
        duration-500
        ease-out

        border-slate-200
        bg-white
        shadow-slate-200/50

        hover:-translate-y-1
        hover:border-indigo-300
        hover:shadow-xl
        hover:shadow-indigo-500/10

        dark:border-slate-800
        dark:bg-slate-900
        dark:shadow-black/10

        dark:hover:border-indigo-500/30
        dark:hover:shadow-indigo-500/10
      "
    >
      {/* =========================================
          BACKGROUND GLOW
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48

          sm:h-64
          sm:w-64

          rounded-full
          bg-indigo-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-indigo-500/10

          dark:bg-indigo-500/10
          dark:group-hover:bg-indigo-500/15
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-48
          w-48

          rounded-full
          bg-purple-500/5
          blur-3xl

          transition-all
          duration-700

          group-hover:scale-125
          group-hover:bg-purple-500/10

          dark:bg-purple-500/5
        "
      />

      <div className="relative">
        {/* =========================================
            HEADER
        ========================================= */}

        <div
          className="
            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TITLE */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div
              className="
                flex
                h-10
                w-10

                sm:h-12
                sm:w-12

                shrink-0
                items-center
                justify-center

                rounded-lg
                sm:rounded-xl

                border

                border-indigo-200
                bg-indigo-50
                text-indigo-600

                transition-all
                duration-500

                group-hover:scale-110
                group-hover:rotate-3
                group-hover:border-indigo-300
                group-hover:bg-indigo-100

                dark:border-indigo-500/20
                dark:bg-indigo-500/10
                dark:text-indigo-400

                dark:group-hover:border-indigo-500/30
                dark:group-hover:bg-indigo-500/15
              "
            >
              <Users
                size={20}
                className="sm:hidden"
              />

              <Users
                size={24}
                className="hidden sm:block"
              />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-lg
                  font-bold
                  tracking-tight

                  text-slate-900
                  dark:text-white

                  sm:text-xl
                  md:text-2xl
                "
              >
                Development Team
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5

                  text-slate-500
                  dark:text-slate-400

                  sm:text-sm
                "
              >
                The team behind SignAI
              </p>
            </div>
          </div>

          {/* TEAM COUNT */}

          <div
            className="
              flex
              w-fit
              shrink-0
              items-center
              gap-2

              rounded-full
              border

              px-3
              py-1.5

              text-xs
              font-medium

              border-indigo-200
              bg-indigo-50
              text-indigo-600

              transition-all
              duration-300

              group-hover:border-indigo-300
              group-hover:bg-indigo-100

              dark:border-indigo-500/20
              dark:bg-indigo-500/10
              dark:text-indigo-400

              dark:group-hover:border-indigo-500/30
            "
          >
            <Users size={14} />

            <span>
              {teamMembers.length} Members
            </span>
          </div>
        </div>

        {/* =========================================
            TEAM MEMBERS
        ========================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3

            sm:mt-7
            sm:gap-4
          "
        >
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="
                group/member
                relative
                overflow-hidden

                rounded-xl
                border

                px-4
                py-4

                sm:px-5
                sm:py-5

                border-slate-200
                bg-slate-50

                transition-all
                duration-400
                ease-out

                hover:-translate-y-1
                hover:translate-x-1

                hover:border-indigo-300
                hover:bg-white

                hover:shadow-lg
                hover:shadow-indigo-500/10

                dark:border-slate-800
                dark:bg-slate-950/60

                dark:hover:border-indigo-500/30
                dark:hover:bg-slate-950

                dark:hover:shadow-indigo-500/5
              "
            >
              {/* LEFT HOVER ACCENT */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  w-1

                  bg-gradient-to-b
                  from-indigo-500
                  via-purple-500
                  to-indigo-500

                  opacity-0

                  transition-all
                  duration-300

                  group-hover/member:opacity-100
                "
              />

              {/* HOVER GLOW */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10

                  h-28
                  w-28

                  rounded-full

                  bg-indigo-500/0
                  blur-3xl

                  transition-all
                  duration-500

                  group-hover/member:bg-indigo-500/10

                  dark:group-hover/member:bg-indigo-500/10
                "
              />

              {/* MEMBER CONTENT */}

              <div
                className="
                  relative
                  flex
                  min-w-0
                  items-center
                  justify-between
                  gap-4
                "
              >
                {/* NAME + EDUCATION */}

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                      truncate
                      text-sm
                      font-semibold

                      text-slate-900

                      transition-colors
                      duration-300

                      group-hover/member:text-indigo-600

                      dark:text-white
                      dark:group-hover/member:text-indigo-400

                      sm:text-base
                    "
                  >
                    {member.name}
                  </h3>

                  <div
                    className="
                      mt-1.5
                      flex
                      min-w-0
                      items-center
                      gap-2
                    "
                  >
                    <GraduationCap
                      size={15}
                      className="
                        shrink-0
                        text-slate-400

                        transition-colors
                        duration-300

                        group-hover/member:text-indigo-500

                        dark:text-slate-500
                        dark:group-hover/member:text-indigo-400
                      "
                    />

                    <p
                      className="
                        truncate
                        text-xs

                        text-slate-500

                        transition-colors
                        duration-300

                        group-hover/member:text-slate-600

                        dark:text-slate-400
                        dark:group-hover/member:text-slate-300

                        sm:text-sm
                      "
                    >
                      {member.education}
                    </p>
                  </div>
                </div>

                {/* MEMBER NUMBER */}

                <div
                  className="
                    flex
                    h-8
                    w-8

                    shrink-0

                    items-center
                    justify-center

                    rounded-lg
                    border

                    text-[11px]
                    font-semibold

                    border-slate-200
                    bg-white
                    text-slate-400

                    transition-all
                    duration-300

                    group-hover/member:border-indigo-200
                    group-hover/member:bg-indigo-50
                    group-hover/member:text-indigo-600

                    dark:border-slate-800
                    dark:bg-slate-900
                    dark:text-slate-500

                    dark:group-hover/member:border-indigo-500/20
                    dark:group-hover/member:bg-indigo-500/10
                    dark:group-hover/member:text-indigo-400

                    sm:h-9
                    sm:w-9
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <div
          className="
            mt-5

            border-t
            pt-4

            border-slate-200
            dark:border-slate-800

            sm:mt-6
            sm:pt-5
          "
        >
          <p
            className="
              text-center

              text-xs
              leading-5

              text-slate-500
              dark:text-slate-400
            "
          >
            A collaborative team building an AI-powered
            Sign Language Recognition system.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;