const TeamSection = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

      <h2 className="text-2xl font-bold text-white mb-6">
        Development Team
      </h2>

      <div className="space-y-5">

        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold">
            Tharun H S
          </h3>

          <p className="text-slate-400">
            Frontend Development
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold">
            Hemanth K J
          </h3>

          <p className="text-slate-400">
            Backend Development
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold">
            AjayKumar M R
          </h3>

          <p className="text-slate-400">
            AI Model Development
          </p>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl">
          <h3 className="text-white font-semibold">
            Vinay V
          </h3>

          <p className="text-slate-400">
            AI Model Development
          </p>
        </div>

      </div>

    </div>
  );
};

export default TeamSection;