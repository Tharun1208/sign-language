import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-950">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;