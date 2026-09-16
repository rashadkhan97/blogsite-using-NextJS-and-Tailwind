// Must match backend/controllers/blogController.js's CATEGORIES exactly —
// that list is what the backend accepts on create/update.
export const CATEGORIES = ["Testing", "Automation", "Programming", "DevOps", "AI"];

// "All" is a frontend-only filter option, never sent as a real category.
export const FILTER_CATEGORIES = ["All", ...CATEGORIES];
