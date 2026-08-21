import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-indigo-500/[0.035] blur-3xl dark:bg-indigo-500/[0.06]" />

        <div className="absolute right-[-180px] top-[15%] h-[420px] w-[420px] rounded-full bg-purple-500/[0.025] blur-3xl dark:bg-purple-500/[0.045]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[380px] w-[380px] rounded-full bg-blue-500/[0.025] blur-3xl dark:bg-blue-500/[0.04]" />
      </div>

      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside className="relative z-30 shrink-0">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* =========================================================
          MAIN APPLICATION
      ========================================================= */}

      <div className="relative z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        {/* =======================================================
            TOPBAR
        ======================================================= */}

        <header
          className="
            relative
            z-20
            shrink-0

            border-b
            border-slate-200/80
            bg-white/85

            backdrop-blur-xl

            dark:border-slate-800/80
            dark:bg-slate-950/85
          "
        >
          <Topbar />
        </header>

        {/* =======================================================
            MAIN CONTENT
        ======================================================= */}

        <main
          className="
            relative
            min-h-0
            min-w-0
            flex-1

            overflow-y-auto
            overflow-x-hidden

            scroll-smooth

            bg-transparent

            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-slate-300

            dark:scrollbar-thumb-slate-700
          "
        >
          {/* =====================================================
              TOP FADE / GRID EFFECT
          ===================================================== */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/[0.025] to-transparent dark:from-indigo-500/[0.04]" />

          {/* =====================================================
              CONTENT CONTAINER
          ===================================================== */}

          <div
            className="
              relative
              mx-auto
              w-full
              max-w-[1800px]

              px-4
              py-5

              sm:px-6
              sm:py-6

              md:px-8
              md:py-8

              lg:px-10
              lg:py-9

              xl:px-12
              xl:py-10

              2xl:px-14
            "
          >
            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <div className="animate-[fadeIn_0.35s_ease-out]">
              {children}
            </div>

            {/* =================================================
                BOTTOM SPACING
            ================================================= */}

            <div className="h-8 sm:h-10" />
          </div>
        </main>
      </div>

      {/* =========================================================
          GLOBAL ANIMATION
      ========================================================= */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Chrome / Edge / Safari */
          main::-webkit-scrollbar {
            width: 7px;
          }

          main::-webkit-scrollbar-track {
            background: transparent;
          }

          main::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.35);
            border-radius: 9999px;
          }

          main::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.45);
          }

          .dark main::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.45);
          }

          .dark main::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;