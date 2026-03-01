import simpleLayout from "./simple";
import naiveJustifiedLayout from "./naiveJustified";

// Registry of all available layout plugins
export const layouts = {
  simple: simpleLayout,
  justified: naiveJustifiedLayout,
};

// ✏️ Change this flag to switch layouts: 'simple' | 'justified'
export const ACTIVE_LAYOUT = "justified";
