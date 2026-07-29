// Controls where the Concierge widget is visible vs hidden

const HIDDEN_PATHS = [
  "/", // Homepage has inline Concierge
  "/discover", // Has full-screen Concierge
  "/dashboard",
  "/operator",
  "/login",
  "/signup",
  "/auth",
];

const HIDDEN_PATH_PREFIXES = [
  "/dashboard/",
  "/operator/",
  "/auth/",
  "/factory/", // Will check unlock sub-paths separately
];

export function isConciergeWidgetVisible(pathname: string): boolean {
  // Hidden on exact paths
  if (HIDDEN_PATHS.includes(pathname)) return false;

  // Hidden on unlock flow
  if (pathname.includes("/unlock")) return false;

  // Hidden on path prefixes (dashboard, operator, auth)
  if (HIDDEN_PATH_PREFIXES.some((p) => pathname.startsWith(p) && p !== "/factory/")) {
    return false;
  }

  // Visible on factory pages (except unlock)
  if (pathname.startsWith("/factory/") && !pathname.includes("/unlock")) {
    return true;
  }

  // Visible on all other pages
  return true;
}
