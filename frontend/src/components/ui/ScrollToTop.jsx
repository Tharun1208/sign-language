import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restores scroll position to the top of the page on navigation, matching
 * what users expect from a multi-page app.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
