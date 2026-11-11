import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";

const NotFound = () => (
  <div className="notfound-shell">
    <main className="notfound" id="main-content">
      <span className="notfound-code" aria-hidden="true">404</span>
      <span className="eyebrow">Page not found</span>
      <h1>This sign is not in the dictionary.</h1>
      <p className="lead">
        The page you followed may have moved, or the link is incomplete. Head
        back to the workspace and continue from there.
      </p>

      <div className="row mt-6" style={{ justifyContent: "center" }}>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          <Home size={18} aria-hidden="true" />
          Back to overview
        </Link>
        <Link to="/dictionary" className="btn btn-ghost btn-lg">
          <Compass size={18} aria-hidden="true" />
          Browse dictionary
        </Link>
      </div>

      <button type="button" className="btn btn-ghost btn-sm mt-6" onClick={() => window.history.back()}>
        <ArrowLeft size={15} aria-hidden="true" />
        Go back
      </button>
    </main>
  </div>
);

export default NotFound;
